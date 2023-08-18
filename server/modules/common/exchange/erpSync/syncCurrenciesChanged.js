const Currency = require('@catalogs/currencies/models');
const exchangeERP = require('./exchangeERP');
const moment = require('moment');

module.exports = async () => {
  console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': Begin sync currencies.');

  const queryResult = await exchangeERP
    .getCurrenciesToExchange()
    .then(async (queryResult) => {
      for (let element of queryResult.data) {
        console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': Import currency: ', element.name);

        let currentCurrency = await Currency.findOne({
          where: { uuid: element.uuid },
        });

        const currencyData = element;

        if (currentCurrency) {
          await Currency.update({ currencyData }, { where: { id: currentCurrency.id } }).catch((err) => {
            console.log(err);
          });
        } else {
          currentCurrency = await Currency.create(currencyData).catch((err) => {
            console.log(err);
          });
        }

        console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': Delete registration for currency ', currentCurrency.name);
        await exchangeERP.deleteObjectRegistration({ object_type: 'currency', object_uuid: element.uuid }).catch((err) => {
          console.log(err);
        });
      }
    })
    .catch((err) => {
      console.error(moment().format('DD.MM.YYYY HH:mm:ss'), ': Problem synchronizacji walut:', err);
    });

  console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': End sync currencies.');
};
