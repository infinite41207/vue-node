const TermOfPayment = require('@catalogs/termsOfPayment/models');
const exchangeERP = require('./exchangeERP');
const moment = require('moment');

module.exports = async () => {
  console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': Begin sync terms of payment.');

  const queryResult = await exchangeERP
    .getTermsOfPaymentToExchange()
    .then(async (queryResult) => {
      for (let element of queryResult.data) {
        console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': Import term of payment: ', element.name);

        let currentTermOfPayment = await TermOfPayment.findOne({
          where: { uuid: element.uuid },
        });

        const { translations, ...termOfPaymentData } = element;

        let lang = {};
        for (let translate of translations) {
          lang[translate.lang] = translate.name;
        }

        termOfPaymentData.lang = JSON.stringify(lang);

        if (currentTermOfPayment) {
          await TermOfPayment.update({ ...termOfPaymentData }, { where: { id: currentTermOfPayment.id } }).catch((err) => {
            console.log(err);
          });
        } else {
          currentTermOfPayment = await TermOfPayment.create(termOfPaymentData).catch((err) => {
            console.log(err);
          });
        }

        console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': Delete registration for term of payment ', currentTermOfPayment.name);
        await exchangeERP.deleteObjectRegistration({ object_type: 'term_of_payment', object_uuid: element.uuid }).catch((err) => {
          console.log(err);
        });
      }
    })
    .catch((err) => {
      console.error(moment().format('DD.MM.YYYY HH:mm:ss'), ': Problem synchronizacji terminów płatności:', err);
    });

  console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': End sync terms of payment.');
};
