const Product = require('@catalogs/products/models')
const Pricelist = require('@documents/pricelists/models/pricelist')
const Discount = require('@documents/discounts/models')
const Customer = require('@catalogs/counterparties/models')
const exchangeERP = require('./exchangeERP')
const moment = require('moment')

module.exports = async () => {
  console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': Begin sync discounts')

  await exchangeERP
    .getDiscounts()
    .then(async (discounts) => {
      if (!discounts.data) {
        return
      }

      for (let prodDiscount of discounts.data) {
        console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': Begin import discount: ', prodDiscount.number)
        prodDiscount.filters = JSON.stringify(prodDiscount.filters)

        if (prodDiscount.endDate == '') {
          prodDiscount.endDate = null
        }

        currentCustomer = await Customer.findOne({ where: { uuid: prodDiscount.customer } })

        if (currentCustomer) {
          prodDiscount.customerId = currentCustomer.id
        }

        currentProduct = await Product.findOne({ where: { uuid: prodDiscount.product } })

        if (currentProduct) {
          prodDiscount.productId = currentProduct.id
        }

        currentPricelist = await Pricelist.findOne({ where: { uuid: prodDiscount.pricelist } })

        if (currentPricelist) {
          prodDiscount.pricelistId = currentPricelist.id
        }

        let currentDiscount = await Discount.findOne({
          where: {
            uuid: prodDiscount.uuid,
          },
        })

        if (currentDiscount) {
          await Discount.update(prodDiscount, {
            where: { id: currentDiscount.id },
          }).catch((err) => {
            console.log(err)
          })
        } else {
          currentDiscount = await Discount.create(prodDiscount).catch((err) => {
            console.log(err)
          })
        }

        console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': Delete registration for discount ', currentDiscount.number)
        await exchangeERP.deleteObjectRegistration({ object_type: 'discount', object_uuid: currentDiscount.uuid }).catch((err) => {
          console.log(err)
        })
      }
    })
    .catch((err) => {
      console.log(err)
    })

  console.log(moment().format('DD.MM.YYYY HH:mm:ss'), ': End sync discounts')
}
