const SalesOrderStatus = require('@catalogs/salesOrderStatuses/models');
const SalesOrder = require('@documents/SalesOrder/models/order');
const exchangeERP = require('./exchangeERP');
const moment = require('moment');

module.exports = async () => {
  console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': Begin sync salses orders.');

  const queryResult = await exchangeERP
    .getSalesOrdersToExchange()
    .then(async (queryResult) => {
      for (let element of queryResult.data) {
        console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': Import sales order: ', element.number);

        let currentSalesOrder = await SalesOrder.findOne({
          where: { id: element.id },
        });

        if (currentSalesOrder) {
          let currentSalesOrderStatus = await SalesOrderStatus.findOne({
            where: { uuid: element.statusUuid },
          });

          if (currentSalesOrderStatus) {
            await currentSalesOrder.update({ statusId: currentSalesOrderStatus.id }).catch((err) => {
              console.error(err);
            });
          }
        }

        console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': Delete registration for sales order ', currentSalesOrder.number);

        await exchangeERP.deleteObjectRegistration({ object_type: 'salesOrder', object_uuid: element.uuid }).catch((err) => {
          console.log(err);
        });
      }
    })
    .catch((err) => {
      console.error(moment().format('DD.MM.YYYY HH:mm:ss'), ': Problem synchronizacji zamówień klienta:', err);
    });

  console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': End sync sales orders.');
};
