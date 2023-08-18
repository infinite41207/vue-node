const { Op } = require('sequelize')
const moment = require('moment')

const Pricelist = require('../models/pricelist')
const PricelistCustomer = require('../models/pricelistCustomer')
const PricelistDimension = require('../models/pricelistDimension')
const PricelistTable = require('../models/pricelistTable')
const Product = require('@catalogs/products/models')
const Customer = require('@catalogs/counterparties/models')
const Parameter = require('@catalogs/constructor/models/parameter')

const PricesService = require('@services/pricesService')

module.exports = {
  async findAll(req, res, next) {
    let filter = JSON.parse(req.query.filter || '{}')
    const pagination = JSON.parse(req.query.pagination || '{}')
    const sort = JSON.parse(req.query.sort || '{}')

    if (filter.searchStr) {
      filter[Op.or] = [
        { number: { [Op.iLike]: `%${filter.searchStr}%` } },
        { priceCode: { [Op.iLike]: `%${filter.searchStr}%` } },
        { description: { [Op.iLike]: `%${filter.searchStr}%` } },
      ]
      delete filter.searchStr
    }

    if (filter.period) {
      const dateFrom = filter.period[0]
      const dateTo = moment(filter.period[1]).endOf('day').toISOString()

      filter.date = { [Op.between]: [dateFrom, dateTo] }
      delete filter.period
    }

    attributes = { exclude: ['productId'] }

    let order = []
    if (sort.sortBy) {
      let sortItem = sort.sortBy.split('.')
      if (sort.sortDesc === true) {
        sortItem.push('DESC')
      }
      order.push(sortItem)
    }

    order.push(['id'])

    const include = [
      {
        model: Product,
        as: 'product',
        attributes: ['id', 'name'],
      },
      {
        model: PricelistCustomer,
        as: 'customers',
      },
    ]

    let productPrices = null

    if (pagination.page) {
      let limit = pagination.limit
      let offset = 0 + (pagination.page - 1) * limit

      productPrices = await Pricelist.findAndCountAll({
        where: filter,
        offset: offset,
        limit: limit,
        attributes,
        include,
        order,
      }).catch((error) => {
        console.error(error)
        return res.status(400).send(error)
      })
    } else {
      productPrices = await Pricelist.findAll({
        where: filter,
        attributes,
        include,
        order,
      }).catch((error) => {
        console.error(error)
        return res.status(400).send(error)
      })
    }

    if (productPrices) {
      res.status(200).send(productPrices)
    } else {
      res.status(400).send({
        message: 'Bad request',
      })
    }
  },

  async findById(req, res, next) {
    const productPrice = await Pricelist.findByPk(req.params.id, {
      include: [
        {
          model: PricelistCustomer,
          as: 'customers',
          include: [
            {
              model: Customer,
              as: 'customer',
              attributes: ['id', 'name'],
            },
          ],
        },
        {
          model: PricelistDimension,
          as: 'dimensions',
          include: [
            {
              model: Parameter,
              as: 'dimension',
            },
          ],
        },
        {
          model: PricelistTable,
          as: 'prices',
        },
      ],
    })

    if (productPrice) {
      res.status(200).send(productPrice)
    } else {
      res.status(400).send({ message: 'Product price not find' })
    }
  },

  async calculateProductPrices(req, res, next) {
    await PricesService.calculateProductPrices(req.body)
      .then((prices) => {
        res.status(200).send(prices)
      })
      .catch((error) => {
        console.error(error)
        res.status(400).send({ message: 'Calculate error!' })
      })
  },
}
