const Customer = require('@catalogs/counterparties/models')
const SalesOrder = require('@documents/salesOrders/models/order')
const SalesOrderStatus = require('@catalogs/salesOrderStatuses/models')
const Currency = require('@catalogs/currencies/models')
const User = require('@catalogs/users/models')
const logger = require('@logging/logger')

const exchangeOknoERP = require('./exchangeOknoERP')
const moment = require('moment')

module.exports = async () => {
  console.log('Begin of sync of sales orders...')

  const queryResult = await exchangeOknoERP
    .getSalesOrders()
    .then(async (queryResult) => {
      for (let item of queryResult) {
        let i = 1
        //console.log('Import sales orders: ', item.DocNumber, '-->');

        const customer = await Customer.findOne({
          where: { uuid: item.customerUuid },
        })

        let currentDeliveryDate = moment()
        if (item.deliveryDate && item.deliveryDate !== '01.01.0001 00:00:00') {
          currentDeliveryDate = moment(item.DocDate, 'DD.MM.YYYY hh:mm:ss').toISOString()
        }

        let currentShipmentDate = moment()
        if (item.shipmentDate && item.shipmentDate !== '01.01.0001 00:00:00') {
          // console.log(item.shipmentDate)
          currentShipmentDate = moment(item.shipmentDate, 'DD.MM.YYYY hh:mm:ss').toISOString()
        }

        if (customer) {
          const salesOrderData = {
            uuid: item.uuid,
            customerId: customer.id,
            numberStr: item.DocNumber,
            number: i,
            proforma: item.proforma,
            reference: item.reference,
            prefix: 'ZLC',
            deliveryDate: currentDeliveryDate,
            shipmentDate: currentShipmentDate,
            deliveryMethod: 'Spedycja',
            postCode: item.PostCode,
            address: item.FullAddress ? item.FullAddress : item.Address,
            packageMaterial: 'Karton',
            project: item.project,
            sumVat: item.sumVat,
            sumBrutto: item.sumBrutto,
            sumNetto: item.sumNetto,
            markedToDelete: false,
            comment: item.comment,
          }

          const status = await SalesOrderStatus.findOne({ where: { name: item.status } }).catch((error) => {
            console.error(error)
          })

          if (status) {
            salesOrderData.statusId = status.id
          } else {
            const newStatus = await SalesOrderStatus.create({ name: item.status, code: '1' }).catch((error) => {
              console.error(error)
            })

            if (newStatus) {
              salesOrderData.statusId = newStatus.id
            }
          }

          const currency = await Currency.findOne({ where: { name: item.currency } }).catch((error) => {
            console.error(error)
          })

          if (currency) {
            salesOrderData.currencyId = currency.id
          } else {
            const newCurrency = await Currency.create({ name: item.currency, fullName: item.currency, code: '1' }).catch((error) => {
              console.error(error)
            })

            if (newCurrency) {
              salesOrderData.currencyId = newCurrency.id
            }
          }

          if (item.Konstructor) {
            let currentConstructor = await User.findOne({
              where: { uuid: item.KonstructorUuid },
            })

            if (!currentConstructor) {
              const constructorData = {
                uuid: item.KonstructorUuid,
                name: item.Konstructor,
                email: String(item.Konstructor).replace(/\s/g, '') + '@office.pl',
                password: 'd[a#qkdsf-ASD239uf20',
                isActive: false,
                useCustomerAccess: false,
                fullRights: false,
                isConstructor: true,
              }
              currentConstructor = await User.create(constructorData).catch((err) => {
                console.log(err)
              })
            }
            salesOrderData.responsible = currentConstructor.id
          }

          const salesOrder = await SalesOrder.findOne({
            where: { uuid: salesOrderData.uuid },
          })

          i++

          if (salesOrder) {
            await SalesOrder.update(salesOrderData, { where: { id: salesOrder.id } }).catch((err) => {
              console.log(err)
              logger.error('Error in syncSalesOrdersFull update SalesOrder', { meta: err })
            })
          } else {
            await SalesOrder.create(salesOrderData).catch((err) => {
              console.log(err)
              logger.error('Error in syncSalesOrdersFull create SalesOrder', { meta: err })
            })
          }
        } else {
          console.log('Nie znaleziono kontrahenta z uuid ', item.customerUuid)
        }
      }
    })
    .catch((err) => {
      console.error('Proplem synchronizacji zamówień klientóœ:', err)
    })

  console.log('End of sync of sales orders.')
}
