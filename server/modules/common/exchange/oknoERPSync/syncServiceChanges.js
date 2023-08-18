const config = require('config')

module.exports = async () => {
  // if (config.get('oknoErp_exchange.counterparties')) {
  await require('./syncCustomersChanges')()
  // }

  // if (config.get('oknoErp_exchange.salesOrders')) {
  await require('./syncSalesOrdersChanges')()
  // }

  // if (config.get('oknoErp_exchange.products')) {
  await require('./syncProductsChanges')()
  // }
}
