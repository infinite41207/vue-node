const { Op, Sequelize } = require('sequelize')

const Customer = require('@catalogs/counterparties/models')
const Country = require('@catalogs/countries/models')
const Pricelist = require('@documents/pricelists/models/pricelist')
const PricelistCustomer = require('@documents/pricelists/models/pricelistCustomer')
const PricelistDimension = require('@documents/pricelists/models/pricelistDimension')
const PricelistTable = require('@documents/pricelists/models/pricelistTable')
const PricelistServiceFilter = require('@documents/pricelists/models/pricelistServiceFilter')
const Discounts = require('@documents/discounts/models')
const ConstructorService = require('./constructorService')
const moment = require('moment')

module.exports = {
  async calculateProductPrices(orderData) {
    return await Customer.findByPk(orderData.customerId, { include: [{ model: Country, as: 'country', atributes: ['id', 'name', 'uuid'] }] })
      .then(async (customerData) => {
        const priceFilters = {
          date: moment().startOf('day').toISOString(),
          customer: orderData.customerId,
          product: orderData.productId,
          priceType: customerData.priceType,
          region: customerData.region,
        }
        return await getPricelists(priceFilters)
          .then(async (pricelists) => {
            const collectedParameters = await ConstructorService.getCollectParameters(orderData.choosenParameters, customerData, false)

            const filteredPricelist = await filterPricelist(pricelists, collectedParameters)

            let calculatedFormules = []
            const calculatedPricelists = await calculatePricelistsPrices(filteredPricelist, collectedParameters, calculatedFormules)

            let priceTable = []
            if (calculatedPricelists) {
              const discountFilters = {
                date: moment().startOf('day').toISOString(),
                customer: orderData.customerId,
                markedToDelete: false,
                confirmed: true,
                product: orderData.productId,
                priceType: customerData.priceType,
                region: customerData.region,
                belonging: ['main', 'surcharge', 'main_and_surcharge', 'surcharge_and_price', 'all'],
                pricelist: calculatedPricelists.map((el) => {
                  return el.id
                }),
              }

              const discounts = await getDiscounts(discountFilters)
              const filteredDiscounts = await discountFilter(discounts, collectedParameters)
              let calculatedFormules = []
              const calculatedDiscounts = await calculateDiscounts(calculatedPricelists, filteredDiscounts, calculatedFormules)

              let inclPrices = []
              let inclDiscounts = []
              let basePricelistRowId

              for (let pricelist of calculatedPricelists) {
                pricelist.basePrice = pricelist.price

                if (!!pricelist.includedInMain) {
                  inclPrices.push(pricelist)
                }

                const tableRowCount = priceTable.push({
                  pricelistId: pricelist.id,
                  priceCode: pricelist.priceCode,
                  priceType: pricelist.pricelistKind,
                  priceDescription: `${pricelist.pricelistKind === 'main' ? 'Podstawowy' : 'Dopłata'} : ${pricelist.priceCode}`,
                  description: pricelist.description,
                  price: pricelist.price,
                  sum: 0,
                  maxDiscount: pricelist.maxDiscount,
                  quantity: orderData.quantity,
                  discountId: null,
                  discountPriority: 0,
                  discountPercent: 0,
                  discountSum: 0,
                  included: [],
                })

                const rowId = tableRowCount - 1

                if (pricelist.pricelistKind === 'main' && !basePricelistRowId) {
                  basePricelistRowId = rowId
                }

                let lastDiscount
                if (!pricelist.notUseDiscount) {
                  for (let discount of calculatedDiscounts) {
                    lastDiscount = discount
                    if (discount.pricelists.includes(pricelist.id)) {
                      if (discount.includeMain) {
                        if (pricelist.pricelistKind === 'main') {
                          if (!inclDiscounts.includes(discount.id)) {
                            inclDiscounts.push(discount.id)
                          }
                        }

                        continue
                      }

                      if (priceTable[rowId].discountId === null) {
                        priceTable[rowId].discountId = discount.id
                        priceTable[rowId].discountPriority = discount.priority

                        if (discount.discountType === 'percent') {
                          priceTable[rowId].discountPercent = discount.percent
                          priceTable[rowId].discountSum = 0
                        } else {
                          if (discount.priceDiscount) {
                            priceTable[rowId].discountPercent = 0
                            priceTable[rowId].discountSum = discount.discount * priceTable[rowId].quantity
                          } else {
                            priceTable[rowId].discountPercent = 0
                            priceTable[rowId].discountSum = (pricelist.price - discount.discount) * priceTable[rowId].quantity
                          }
                        }
                      } else {
                        if (priceTable[rowId].discountPriority > discount.priority) {
                          priceTable[rowId].discountId = discount.id
                          priceTable[rowId].discountPriority = discount.priority

                          if (discount.discountType === 'percent') {
                            priceTable[rowId].discountPercent = discount.percent
                            priceTable[rowId].discountSum = 0
                          } else {
                            if (discount.priceDiscount) {
                              priceTable[rowId].discountPercent = 0
                              priceTable[rowId].discountSum = discount.discount * priceTable[rowId].quantity
                            } else {
                              priceTable[rowId].discountPercent = 0
                              priceTable[rowId].discountSum = (pricelist.price - discount.discount) * priceTable[rowId].quantity
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }

              if (inclPrices.length > 0) {
                for (let inclPrice of inclPrices) {
                  if (basePricelistRowId) {
                    priceTable[basePricelistRowId].price += inclPrice.price
                    priceTable[basePricelistRowId].included.push(inclPrice.id)
                  } else {
                    const tableRowCount = priceTable.push({
                      pricelistId: inclPrice.id,
                      priceCode: inclPrice.priceCode,
                      priceType: inclPrice.pricelistKind,
                      priceDescription: `${inclPrice.pricelistKind === 'main' ? 'Podstawowy' : 'Dopłata'} : ${inclPrice.priceCode}`,
                      description: inclPrice.description,
                      price: inclPrice.price,
                      sum: 0,
                      maxDiscount: inclPrice.maxDiscount,
                      quantity: orderData.quantity,
                      discountId: null,
                      discountPriority: 0,
                      discountPercent: 0,
                      discountSum: 0,
                      included: [],
                    })
                  }
                }
              }

              if (inclDiscounts.length > 0 && basePricelistRowId) {
                let baseDiscountPercent = 0
                let baseDiscountSum = 0

                for (let inclDiscount of inclDiscounts) {
                  if (inclDiscount.discountType === 'percent') {
                    baseDiscountPercent += inclDiscount.percent
                  } else {
                    baseDiscountSum += inclDiscount.discount
                  }
                }

                baseDiscountSum += (priceTable[basePricelistRowId].price * baseDiscountPercent) / 100

                if (priceTable[basePricelistRowId].discountPercent !== 0) {
                  if (priceTable[basePricelistRowId].price * (1 - priceTable[basePricelistRowId].discountPercent) > priceTable[basePricelistRowId].price - baseDiscountSum) {
                    priceTable[basePricelistRowId].discountId = lastDiscount.id
                    priceTable[basePricelistRowId].price -= baseDiscountSum
                    priceTable[basePricelistRowId].discountSum = 0
                    priceTable[basePricelistRowId].discountPercent = 0
                  }
                } else {
                  if (
                    priceTable[basePricelistRowId].price * priceTable[basePricelistRowId].quantity - priceTable[basePricelistRowId].discountSum >
                    priceTable[basePricelistRowId].price - baseDiscountSum
                  ) {
                    priceTable[basePricelistRowId].discountId = lastDiscount.id
                    priceTable[basePricelistRowId].price -= baseDiscountSum
                    priceTable[basePricelistRowId].discountSum = 0
                    priceTable[basePricelistRowId].discountPercent = 0
                  }
                }
              }

              for (let priceRow of priceTable) {
                priceRow.sum = (priceRow.quantity * priceRow.price).toFixed(2)

                if (priceRow.discountSum !== 0) {
                  priceRow.discountPercent = ((priceRow.discountSum / priceRow.sum) * 100).toFixed(2)
                  priceRow.sum -= priceRow.discountSum
                } else if (priceRow.discountPercent !== 0) {
                  priceRow.discountSum = ((priceRow.sum * priceRow.discountPercent) / 100).toFixed(2)
                  priceRow.sum -= priceRow.discountSum
                }
              }
            }

            //sort price table
            priceTable.sort((a, b) => {
              if (a.priceType > b.priceType) {
                return 1
              }

              if (a.priceType < b.priceType) {
                return -1
              }

              return 0
            })

            return priceTable
          })
          .catch((err) => {
            throw err
          })
      })
      .catch((err) => {
        throw err
      })
  },
}

async function getPricelists(priceFilters) {
  let pricelistFilter = {
    productId: priceFilters.product,
  }

  pricelistFilter.markedToDelete = { [Op.ne]: true }
  pricelistFilter.confirmed = true

  if (priceFilters.date !== '') {
    pricelistFilter.beginDate = { [Op.lte]: priceFilters.date }
    pricelistFilter.endDate = { [Op.or]: [{ [Op.gte]: priceFilters.date }, null] }
  }
  if (priceFilters.priceType !== '') {
    pricelistFilter.priceType = { [Op.or]: [priceFilters.priceType, ''] }
  }
  if (priceFilters.region !== '') {
    pricelistFilter.region = { [Op.or]: [priceFilters.region, ''] }
  }

  return await Pricelist.findAll({
    where: pricelistFilter,
    include: [
      { model: PricelistCustomer, as: 'customers', require: false },
      { model: PricelistServiceFilter, as: 'service_filters', require: false },
      { model: PricelistDimension, as: 'dimensions', require: false },
    ],
    order: [[{ model: PricelistDimension, as: 'dimensions' }, 'sortNumber', 'ASC']],
  })
    .then((pricelists) => {
      pricelists = JSON.stringify(pricelists)
      pricelists = JSON.parse(pricelists)

      let filteredPricelists = pricelists.filter((el) => {
        if (el.customers.length === 0) return true

        const hasCustomer = el.customers.find((cEl) => cEl.customerId === priceFilters.customer)
        if (hasCustomer) return true
      })

      return filteredPricelists
    })
    .catch((error) => {
      throw error
    })
}

async function filterPricelist(pricelists, collectedParameters) {
  let filteredList = []

  filteredList = await pricelistExpressFilter(pricelists, collectedParameters)
  filteredList = await pricelistDetailFilter(filteredList, collectedParameters)

  return filteredList
}

async function pricelistExpressFilter(pricelists, collectedParameters) {
  let filteredList = []
  for (let pricelist of pricelists) {
    if (pricelist.service_filters && pricelist.service_filters.length > 0) {
      for (let filter of pricelist.service_filters) {
        const fieldValue = collectedParameters[filter.field]

        if (!fieldValue) {
          filteredList.push(pricelist)
          break
        } else {
          if (fieldValue === filter.value) {
            filteredList.push(pricelist)
            break
          }
        }
      }
    } else {
      filteredList.push(pricelist)
    }
  }

  return filteredList
}

async function pricelistDetailFilter(pricelists, collectedParameters) {
  let filteredList = []
  for (let pricelist of pricelists) {
    let filters = JSON.parse(pricelist.filters)

    if (filters && filters.length > 0) {
      if (ConstructorService.checkFilter(filters, collectedParameters, '&&')) {
        filteredList.push(pricelist)
      }
    } else {
      filteredList.push(pricelist)
    }
  }

  return filteredList
}

async function calculatePricelistsPrices(pricelists, collectedParameters, calculatedFormules) {
  for (let pricelist of pricelists) {
    if (pricelist.pricingMethod === 'fixed') {
      //do nothing
    } else if (pricelist.pricingMethod === 'scale') {
      const dimX = pricelist.dimensions[0].dimensionUuid

      const dimValue = collectedParameters[dimX]
      if (!dimValue) {
        console.error('Dimension value not found!', pricelist.priceCode)
      } else {
        const prices = await PricelistTable.findAll({
          where: { pricelistId: pricelist.id, minX: { [Op.lt]: dimValue }, maxX: { [Op.gte]: dimValue } },
          attributes: ['price'],
        })

        if (prices && prices.length > 0) {
          pricelist.price = prices[0].price
        } else {
          pricelist.price = 0
        }
      }
    } else if (pricelist.pricingMethod === 'table') {
      const dimX = pricelist.dimensions[0].dimensionUuid
      const dimY = pricelist.dimensions[1].dimensionUuid

      const dimValueX = collectedParameters[dimX]
      const dimValueY = collectedParameters[dimY]

      if (!dimValueX || !dimValueY) {
        console.error('Dimension value not found!', pricelist.priceCode)
      } else {
        const prices = await PricelistTable.findAll({
          where: {
            pricelistId: pricelist.id,
            minX: { [Op.lt]: dimValueX },
            maxX: { [Op.gte]: dimValueX },
            minY: { [Op.lt]: dimValueY },
            maxY: { [Op.gte]: dimValueY },
          },
          attributes: ['price'],
        })

        if (prices && prices.length > 0) {
          pricelist.price = prices[0].price
        } else {
          pricelist.price = 0
        }
      }
    } else if (pricelist.pricingMethod === 'formula') {
      let calculatedFormula = calculatedFormules.find((elF) => {
        return elF.formula === pricelist.priceFormula
      })

      if (calculatedFormula) {
        pricelist.price *= calculatedFormula.value
      } else {
        calculatedFormula = await calculateExpression(pricelist.priceFormula, collectedParameters)

        calculatedFormules.push({ formula: pricelist.priceFormula, value: calculatedFormula.value })
        pricelist.price *= calculatedFormula.value
      }
    }
  }

  //calculate percent pricelists
  for (let pricelist of pricelists) {
    if (pricelist.pricingMethod === 'percent') {
      let percent = pricelist.price
      let basePrice = 0
      let basePricelists = pricelists.filter((elF) => {
        return elF.pricelistKind === 'main'
      })

      for (let basePricelist of basePricelists) {
        try {
          basePrice += Number(basePricelist.price)
        } catch (error) {}
      }

      pricelist.price = (basePrice * percent) / 100
    }
  }

  return pricelists
}

async function calculateExpression(expression, collectedParameters) {
  let curExpression = expression
  let value = 0

  for (let key in collectedParameters) {
    let parValue = collectedParameters[key]

    if (parValue !== undefined && parValue !== null) {
      if (parValue.length === 36) {
        curExpression = curExpression.replace('#' + key + '#', '"' + parValue + '"')
      } else {
        curExpression = curExpression.replace('#' + key + '#', parValue)
      }
    }
  }

  try {
    value = eval(curExpression)
    return { value, calculated: true }
  } catch (error) {
    const regExp = /#[0-9a-f-]{36}#/g

    if (regExp.test(curExpression)) {
      curExpression = curExpression.replace(regExp, 0)

      try {
        value = eval(curExpression)
        return { value, calculated: false }
      } catch {
        console.error('Error after replace variables:', curExpression)
        return { value: 0, calculated: false }
      }
    } else {
      console.error('Not expression: ', curExpression)
      return { value: 0, calculated: false }
    }
  }
}

async function getDiscounts(discountsFilter) {
  let filter = {}

  if (discountsFilter.date) {
    filter.beginDate = { [Op.lte]: discountsFilter.date }
    filter.endDate = { [Op.or]: [{ [Op.gte]: discountsFilter.date }, { [Op.eq]: null }] }
  }

  if (discountsFilter.hasOwnProperty('markedToDelete')) {
    filter.markedToDelete = { [Op.or]: [discountsFilter.markedToDelete, { [Op.eq]: null }] }
  }

  if (discountsFilter.hasOwnProperty('confirmed')) {
    filter.confirmed = { [Op.or]: [discountsFilter.confirmed, { [Op.eq]: null }] }
  }

  if (discountsFilter.product) {
    if (Array.isArray(discountsFilter.product)) {
      filter.productId = { [Op.or]: [{ [Op.in]: discountsFilter.product }, { [Op.eq]: null }] }
    } else {
      filter.productId = { [Op.or]: [discountsFilter.product, { [Op.eq]: null }] }
    }
  }

  if (discountsFilter.priceType) {
    if (Array.isArray(discountsFilter.priceType)) {
      filter.priceType = { [Op.or]: [{ [Op.in]: discountsFilter.priceType }, ''] }
    } else {
      filter.priceType = { [Op.or]: [discountsFilter.priceType, ''] }
    }
  }

  if (discountsFilter.belonging) {
    if (Array.isArray(discountsFilter.belonging)) {
      filter.belonging = { [Op.in]: discountsFilter.belonging }
    } else {
      filter.belonging = discountsFilter.belonging
    }
  }

  if (discountsFilter.customer) {
    if (Array.isArray(discountsFilter.customer)) {
      filter.customerId = { [Op.in]: discountsFilter.customer }
    } else {
      filter.customerId = discountsFilter.customer
    }
  }

  return await Discounts.findAll({
    where: filter,
    attributes: {
      include: [
        [Sequelize.literal(`CASE "discountType" WHEN 'percent' THEN 0 ELSE price END`), 'discount'],
        [Sequelize.literal(`CASE "discountType" WHEN 'percent' THEN price ELSE 0 END`), 'percent'],
      ],
    },
    order: ['priority', 'date', 'id'],
  })
    .then(async (discounts) => {
      //filper by pricelists

      discounts = JSON.stringify(discounts)
      discounts = JSON.parse(discounts)

      if (discountsFilter.pricelist) {
        let pricelistFilter = { notUseDiscount: false }

        if (Array.isArray(discountsFilter.pricelist)) {
          pricelistFilter.id = { [Op.in]: discountsFilter.pricelist }
        } else {
          pricelistFilter.id = discountsFilter.pricelist
        }

        let prices = await Pricelist.findAll({ where: pricelistFilter, attributes: ['id', 'priceCode', 'pricelistKind'] }).catch((error) => {
          throw error
        })

        if (prices) {
          let filteredDiscounts = []
          for (let discount of discounts) {
            discount.pricelists = []

            let satisfy = false
            for (let price of prices) {
              if (discount.pricelistId === price.id) {
                satisfy = true
                discount.pricelists.push(price.id)
              } else if (discount.priceCode === '' || price.priceCode.includes(discount.priceCode)) {
                if (
                  (price.pricelistKind === 'main' && (discount.belonging === 'main' || discount.belonging === 'all' || discount.belonging === 'main_and_surcharge')) ||
                  (price.pricelistKind === 'surcharge' &&
                    (discount.belonging === 'all' ||
                      discount.belonging === 'surcharge' ||
                      discount.belonging === 'surcharge_and_price' ||
                      discount.belonging === 'main_and_surcharge') &&
                    !discount.includeMain)
                ) {
                  satisfy = true
                  discount.pricelists.push(price.id)
                }
              }
            }

            if (satisfy) {
              filteredDiscounts.push(discount)
            }
          }

          return filteredDiscounts
        }
      }
      return discounts
    })
    .catch((error) => {
      throw error
    })
}

async function discountFilter(discounts, collectedParameters) {
  let filteredList = []
  for (let discount of discounts) {
    let filters = JSON.parse(discount.filters)

    if (filters && filters.length > 0) {
      if (ConstructorService.checkFilter(filters, collectedParameters, '&&')) {
        filteredList.push(discount)
      }
    } else {
      filteredList.push(discount)
    }
  }

  return filteredList
}

async function calculateDiscounts(pricelists, discounts, calculatedFormules) {
  for (let discount of discounts) {
    if (discount.discountType === 'formula') {
      if (discount.priceFormula === '') {
        discount.priceFormula = 1
      }

      let calculatedFormula = calculatedFormules.find((elF) => {
        return elF.formula === discount.priceFormula
      })

      if (calculatedFormula) {
        discount.discount *= calculatedFormula.value
      } else {
        calculatedFormula = calculateExpression(discount.priceFormula, collectedParameters)

        calculatedFormules.push({ formula: discount.priceFormula, value: calculatedFormula.value })
        discount.discount *= calculatedFormula.value
      }
    } else if (discount.discountType === 'percent') {
      let discountSum = 0
      for (let pricelist of discount.pricelists) {
        let fPricelist = pricelists.find((el) => {
          return el.id === pricelist.id
        })

        if (fPricelist) {
          discountSum += (fPricelist.price * discount.percent) / 100
        }

        discount.discount = fPricelist
      }
    } else if (discount.discountType === 'price') {
      // ok
    }
  }

  return discounts
}
