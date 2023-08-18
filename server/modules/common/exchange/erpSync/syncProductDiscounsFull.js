const Product = require('@catalogs/products/models')
const Pricelist = require('@documents/pricelists/models/pricelist')
const Discount = require('@documents/discounts/models')
const Customer = require('@catalogs/counterparties/models')
const exchangeERP = require('./exchangeERP')

module.exports = async () => {
  console.log('\x1b[34m---- Begin sync discounts ----\x1b[0m')

  //++update product pricelist
  await updateProductsDiscount()
  //--update product pricelist
}

async function updateProductsDiscount() {
  await exchangeERP
    .getProductsDiscount()
    .then(async (prodDiscounts) => {
      if (!prodDiscounts.data) {
        return
      }

      for (let prodDiscount of prodDiscounts.data) {
        console.log('Begin import discount: ', prodDiscount.number, '...')
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
      }
    })
    .catch((err) => {
      console.log(err)
    })

  console.log('\x1b[34m---- End sync discounts ----\x1b[0m')
}
