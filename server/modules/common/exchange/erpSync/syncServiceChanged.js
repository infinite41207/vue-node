const config = require('config');

module.exports = async () => {
  console.log('---------------------------');

  await require('./syncParametrizationChanged')();
  await require('./syncCountriesChanged')();
  await require('./syncCurrenciesChanged')();
  await require('./syncTermsOfPaymentChanged')();
  await require('./syncCustomersChanged')();
  await require('./syncAddProductsChanged')();
  await require('./syncAddProductPricesChanged')();

  await require('./syncPricelistChanged')();
  await require('./syncDiscounsChanged')();

  await require('./syncSalesOrderStatusesChanged')();
  await require('./syncProductParamSettings')();
};
