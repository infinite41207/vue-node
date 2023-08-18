const { Op } = require('sequelize')
const moment = require('moment')
const Discount = require('../models')
const Product = require('@catalogs/products/models')
const Customer = require('@catalogs/counterparties/models')

module.exports = {
  async findAll(req, res, next) {
    let filter = JSON.parse(req.query.filter || '{}')
    const pagination = JSON.parse(req.query.pagination || '{}')
    const sort = JSON.parse(req.query.sort || '{}')

    if (filter.searchStr) {
      filter[Op.or] = [{ number: { [Op.iLike]: `%${filter.searchStr}%` } }, { priceCode: { [Op.iLike]: `%${filter.searchStr}%` } }]
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
        model: Customer,
        as: 'customer',
        attributes: ['id', 'name'],
      },
    ]

    let productDiscounts = null

    if (pagination.page) {
      let limit = pagination.limit
      let offset = 0 + (pagination.page - 1) * limit
      productDiscounts = await Discount.findAndCountAll({
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
      productDiscounts = await Discount.findAll({
        where: filter,
        attributes,
        include,
        order,
      }).catch((error) => {
        console.error(error)
        return res.status(400).send(error)
      })
    }

    if (productDiscounts) {
      res.status(200).send(productDiscounts)
    } else {
      res.status(400).send({
        message: 'Bad request',
      })
    }
  },
  async findById(req, res, next) {
    const productDiscount = await Discount.findByPk(req.params.id)

    if (productDiscount) {
      res.status(200).send(productDiscount)
    } else {
      res.status(400).send({ message: 'Discount not find' })
    }
  },
}
