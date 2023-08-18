const Product = require('@catalogs/products/models')
const Pricelist = require('@documents/pricelists/models/pricelist')
const PricelistDimensions = require('@documents/pricelists/models/pricelistDimension')
const PricelistCustomer = require('@documents/pricelists/models/pricelistCustomer')
const PricelistTable = require('@documents/pricelists/models/pricelistTable')
const PricelistServiceFilter = require('@documents/pricelists/models/pricelistServiceFilter')
const Customer = require('@catalogs/counterparties/models')
const Parameter = require('@catalogs/constructor/models/parameter')
const exchangeERP = require('./exchangeERP')
const syncTranslations = require('./syncTranslations')

module.exports = async () => {
  console.log('\x1b[34m---- Begin sync pricelists ----\x1b[0m')

  const products = await Product.findAll({ where: { configProduct: true } })

  if (products) {
    for (let product of products) {
      console.log('\x1b[34m---- Sync pricelists for product', product.name, ' ----\x1b[0m')

      //++update product pricelist
      await updateProductPricelist(product)
      //--update product pricelist
    }

    products.forEach(async (product) => {})
  }

  console.log('\x1b[34m---- End sync pricelists ----\x1b[0m')
}

async function updateProductPricelist(product) {
  await exchangeERP
    .getProductPricelist(product.uuid)
    .then(async (prodPricelist) => {
      if (!prodPricelist.data) {
        return
      }

      for (let productPrice of prodPricelist.data) {
        console.log('\x1b[32m> Begin\x1b[0m import pricelist', productPrice.priceCode, '-->')

        productPrice.productId = product.id
        productPrice.filters = JSON.stringify(productPrice.filters)

        if (productPrice.endDate == '') {
          productPrice.endDate = null
        }

        let currentPricelist = await Pricelist.findOne({
          where: {
            uuid: productPrice.uuid,
          },
        })

        const { customers, price_table, dimensions, service_filters, translations, ...pricelistData } = productPrice

        if (currentPricelist) {
          await Pricelist.update(pricelistData, {
            where: { id: currentPricelist.id },
          }).catch((err) => {
            console.log(err)
          })
        } else {
          currentPricelist = await Pricelist.create(pricelistData).catch((err) => {
            console.log(err)
          })
        }

        await syncTranslations.deleteTranslations('pricelist', pricelistData.uuid)

        if (currentPricelist) {
          if (translations) {
            let catalogInfo = {
              type: 'pricelist',
              id: currentPricelist.id,
              uuid: pricelistData.uuid,
            }
            await syncTranslations.createTranslations(catalogInfo, translations)
          }

          if (dimensions && dimensions.length > 0) {
            await updatePricelistDimensions(currentPricelist, dimensions)
          }

          if (price_table && price_table.length > 0) {
            await updatePricelistTable(currentPricelist, price_table)
          }

          if (service_filters && service_filters.length > 0) {
            await updatePricelistFilters(currentPricelist, service_filters)
          }

          if (customers && customers.length > 0) {
            await updatePricelistCustomers(currentPricelist, customers)
          }
        }

        console.log('\x1b[31m< End\x1b[0m import pricelist', productPrice.priceCode, '.')
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

async function updatePricelistDimensions(pricelist, dimensions) {
  await PricelistDimensions.destroy({
    where: {
      pricelistId: pricelist.id,
    },
  })

  for (let dimensionRow of dimensions) {
    dimensionRow.pricelistId = pricelist.id

    if (dimensionRow.dimension !== '') {
      dimensionRow.dimensionUuid = dimensionRow.dimension
      currentDimension = await Parameter.findOne({ where: { uuid: dimensionRow.dimension } })
      if (currentDimension) {
        dimensionRow.dimensionId = currentDimension.id
      }
    }

    await PricelistDimensions.create(dimensionRow).catch((err) => {
      console.log(err)
    })
  }
}

async function updatePricelistTable(pricelist, price_table) {
  await PricelistTable.destroy({
    where: {
      pricelistId: pricelist.id,
    },
  })

  for (let priceRow of price_table) {
    priceRow.pricelistId = pricelist.id

    await PricelistTable.create(priceRow).catch((err) => {
      console.log(err)
    })
  }
}

async function updatePricelistCustomers(pricelist, customers) {
  await PricelistCustomer.destroy({
    where: {
      pricelistId: pricelist.id,
    },
  })

  for (let customer of customers) {
    customer.pricelistId = pricelist.id

    currentCustomer = await Customer.findOne({ where: { uuid: customer.uuid } })

    if (currentCustomer) {
      customer.customerId = currentCustomer.id
    }

    await PricelistCustomer.create(customer).catch((err) => {
      console.log(err)
    })
  }
}

async function updatePricelistFilters(pricelist, service_filters) {
  await PricelistServiceFilter.destroy({
    where: {
      pricelistId: pricelist.id,
    },
  })

  for (let filter of service_filters) {
    filter.pricelistId = pricelist.id

    await PricelistServiceFilter.create(filter).catch((err) => {
      console.log(err)
    })
  }
}
