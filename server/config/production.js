module.exports = {
  session: {
    name: 'sessionID',
    max_age: 7200000,
  },
  token_validity: {
    passwordResetTokenValidFor: 3600000,
  },
  executors: {
    defaultValues: false,
  },
  erp_exchange: {
    tasks: false,
    products: false,
    addProducts: false,
    addProductPrices: false,
    params: false,
    pricelist: false,
    discounts: false,
    counterparties: false,
  },
  oknoErp_exchange: {
    counterparties: false,
    products: false,
    salesOrders: false,
  },
  enova_exchange: {
    allTabs: false,
  },
  allowedOrigins: [process.env.ALLOW_ORIGIN, 'app://.'],
  logging: {
    combinedLogFileName: 'combined.log',
    errorLogFileName: 'error.log',
    exceptionLogFileName: 'exceptions.log',
  },
  frontendUrls: {
    emailConfirmationBaseUrl: `${process.env.ALLOW_ORIGIN}/email-confirmation`,
    passwordResetBaseUrl: `${process.env.ALLOW_ORIGIN}/password-reset`,
  },
}
