const Customer = require('@catalogs/counterparties/models')
const Country = require('@catalogs/countries/models')
const Currency = require('@catalogs/currencies/models')
const TermOfPayment = require('@catalogs/termsOfPayment/models')
const exchangeERP = require('./exchangeERP')

module.exports = async () => {
  console.log('Begin sync counterparties...')
  const queryResult = await exchangeERP
    .getCustomers(false)
    .then(async (queryResult) => {
      for (let customerData of queryResult.data) {
        console.log('Import customer: ', customerData.name, '-->')
        customerData.deliverySettings = JSON.stringify(customerData.deliverySettings)

        customerData.termOfPaymentId = null
        const termOfPayment = await TermOfPayment.findOne({ where: { uuid: customerData.termsOfPayment } })

        if (termOfPayment) {
          customerData.termOfPaymentId = termOfPayment.id
        }

        delete customerData.termsOfPayment

        customerData.countryId = null
        const country = await Country.findOne({ where: { uuid: customerData.country } })

        if (country) {
          customerData.countryId = country.id
        }

        delete customerData.country

        customerData.currencyId = null
        const currency = await Currency.findOne({ where: { uuid: customerData.currency } })

        if (currency) {
          customerData.currencyId = currency.id
        }

        delete customerData.currency

        const customer = await Customer.findOne({
          where: { uuid: customerData.uuid },
        })

        if (customer) {
          await Customer.update(customerData, { where: { id: customer.id } }).catch((err) => {
            console.log(err)
          })
        } else {
          customerData.status = 'Active'
          await Customer.create(customerData).catch((err) => {
            console.log(err)
          })
        }
      }
    })
    .catch((err) => {
      console.error('Proplem synchronizacji klientów:', err)
    })

  console.log('End sync counterparties.')
}
