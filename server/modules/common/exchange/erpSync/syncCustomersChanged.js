const Customer = require('@catalogs/counterparties/models')
const Country = require('@catalogs/countries/models')
const Currency = require('@catalogs/currencies/models')
const TermOfPayment = require('@catalogs/termsOfPayment/models')
const exchangeERP = require('./exchangeERP')
const moment = require('moment')

module.exports = async () => {
  console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': Begin sync counterparties...')
  const queryResult = await exchangeERP
    .getCustomers(true)
    .then(async (queryResult) => {
      for (let customerData of queryResult.data) {
        console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': Import customer: ', customerData.name)
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
          await Customer.create(customerData).catch((err) => {
            console.log(err)
          })
        }

        console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': Delete registration for customer ', customerData.name)
        await exchangeERP.deleteObjectRegistration({ object_type: 'customer', object_uuid: customerData.uuid }).catch((err) => {
          console.log(err)
        })
      }
    })
    .catch((err) => {
      console.error(moment().format('DD.MM.YYYY HH:mm:ss'), ': Proplem synchronizacji klientów:', err)
    })

  console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': End sync counterparties.')
}
