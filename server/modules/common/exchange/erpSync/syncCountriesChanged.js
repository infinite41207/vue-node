const Country = require('@catalogs/countries/models');
const exchangeERP = require('./exchangeERP');
const moment = require('moment');

module.exports = async () => {
  console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': Begin sync countries.');

  const queryResult = await exchangeERP
    .getCountriesToExchange()
    .then(async (queryResult) => {
      for (let element of queryResult.data) {
        console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': Import country: ', element.name);

        let currentCountry = await Country.findOne({
          where: { uuid: element.uuid },
        });

        const countryData = element;

        if (currentCountry) {
          await Country.update({ countryData }, { where: { id: currentCountry.id } }).catch((err) => {
            console.log(err);
          });
        } else {
          currentCountry = await Country.create(countryData).catch((err) => {
            console.log(err);
          });
        }

        console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': Delete registration for country ', currentCountry.name);
        await exchangeERP.deleteObjectRegistration({ object_type: 'country', object_uuid: element.uuid }).catch((err) => {
          console.log(err);
        });
      }
    })
    .catch((err) => {
      console.error(moment().format('DD.MM.YYYY HH:mm:ss'), ': Problem synchronizacji krajów:', err);
    });

  console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': End sync countries.');
};
