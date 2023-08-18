const SalesOrderStatus = require('@catalogs/salesOrderStatuses/models');
const exchangeERP = require('./exchangeERP');
const moment = require('moment');

module.exports = async () => {
  console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': Begin sync salses order statuses.');

  const queryResult = await exchangeERP
    .getSalesOrderStatusesToExchange()
    .then(async (queryResult) => {
      for (let element of queryResult.data) {
        console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': Import sales order status: ', element.name);

        let currentSalesOrderStatus = await SalesOrderStatus.findOne({
          where: { uuid: element.uuid },
        });

        let { translations, ...statusData } = element;

        let lang = {};
        for (let translate of translations) {
          lang[translate.lang] = translate.name;
        }

        statusData.lang = JSON.stringify(lang);

        if (currentSalesOrderStatus) {
          await SalesOrderStatus.update({ ...statusData }, { where: { id: currentSalesOrderStatus.id } }).catch((err) => {
            console.log(err);
          });
        } else {
          currentSalesOrderStatus = await SalesOrderStatus.create(statusData).catch((err) => {
            console.log(err);
          });
        }

        console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': Delete registration for status ', currentSalesOrderStatus.name);
        await exchangeERP.deleteObjectRegistration({ object_type: 'sales_order_status', object_uuid: element.uuid }).catch((err) => {
          console.log(err);
        });
      }
    })
    .catch((err) => {
      console.error(moment().format('DD.MM.YYYY HH:mm:ss'), ': Problem synchronizacji statusów:', err);
    });

  console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': End sync sales order statuses.');
};
