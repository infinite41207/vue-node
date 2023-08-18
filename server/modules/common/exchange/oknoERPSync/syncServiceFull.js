const config = require('config')

module.exports = () => {
  // if (config.get('oknoErp_exchange.counterparties')) {
  require('./syncCustomersFull')()
  // }

  // if (config.get('oknoErp_exchange.salesOrders')) {
  require('./syncSalesOrdersFull')()
  // }

  // if (config.get('oknoErp_exchange.products')) {
  require('./syncProductsFull')()
  // }
}
