const config = require('config')

module.exports = () => {
  if (config.get('erp_exchange.products')) {
    require('./syncProductsFull')()
  }

  if (config.get('erp_exchange.params')) {
    require('./syncParametrizationFull')()
  }

  if (config.get('erp_exchange.pricelist')) {
    require('./syncProductPricelistFull')()
  }

  if (config.get('erp_exchange.discounts')) {
    require('./syncProductDiscounsFull')()
  }

  if (config.get('erp_exchange.counterparties')) {
    require('./syncCustomersFull')()
  }

  if (config.get('erp_exchange.addProducts')) {
    require('./syncAddProductsFull')()
  }

  if (config.get('erp_exchange.addProductPrices')) {
    require('./syncAddProductPricesFull')()
  }
}
