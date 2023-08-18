const Customer = require('@catalogs/counterparties/models')
const exchangeOknoERP = require('./exchangeOknoERP')
//const logger = require('@logging/logger');
const Employees = require('@catalogs/employees/models')

module.exports = async () => {
  console.log('Begin sync of counterparties...')
  const customersLoadedList = []

  const queryResult = await exchangeOknoERP
    .getCustomersChanges()
    .then(async (queryResult) => {
      for (let item of queryResult) {
        const customerData = {
          uuid: item.uuid,
          name: item.Customer,
          nip: item.nip,
          customerGroup: item.customerGroup,
          abbreviation: 'fr',
          language: 'pl',
          packageMaterial: 'Folia',
          address: item.FullAddress,
          phone: item.Phone,
          email: item.Email,
          region: item.City,
          priceType: 'stock',
          deliverySettings: 'incoterms',
          currencyStr: 'EUR',
          countryStr: item.Country,
          termOfPaymentStr: '7',
        }

        if (item.Trader) {
          let currentTrader = await Employees.findOne({
            where: { uuid: item.Trader.TreaderUuid },
          })

          if (!currentTrader) {
            const traderData = {
              uuid: item.Trader.TreaderUuid,
              name: item.Trader.TraderName,
              email: '-',
              phone: '-',
              markedToDelete: false,
            }
            currentTrader = await Employees.create(traderData).catch((err) => {
              console.log(err)
            })
          }
          customerData.managerId = currentTrader.id
        }

        //console.log('Import customer: ', customerData.name, '-->');

        const customer = await Customer.findOne({
          where: { uuid: item.uuid },
        })

        if (customer) {
          await Customer.update(customerData, { where: { id: customer.id } })
            .then(async () => {
              console.log('Update customer: ', customerData.name, '-->')
              customersLoadedList.push({ uuid: customerData.uuid })
            })
            .catch((err) => {
              console.log(err)
              //logger.error('Error in syncSalesOrdersChanges update Customer', { meta: err });
            })
        } else {
          customerData.status = 'Active'
          await Customer.create(customerData)
            .then(async () => {
              console.log('Create customer: ', customerData.name, '-->')
              customersLoadedList.push({ uuid: customerData.uuid })
            })
            .catch((err) => {
              console.log(err)
              //logger.error('Error in syncSalesOrdersChanges create Customer', { meta: err });
            })
        }
      }
    })
    .catch((err) => {
      console.error('Proplem synchronizacji klientów:', err)
    })

  await exchangeOknoERP.deleteCustomersChanges({ uuids: customersLoadedList }).catch((err) => {
    console.error('Problem z usunięciem z rejestracji klientów:', err)
  })

  console.log('End sync counterparties.')
}
