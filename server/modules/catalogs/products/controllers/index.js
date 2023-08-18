const ObjectModel = require('../models/index')
const uuidlib = require('uuid')
const httpStatus = require('http-status-codes')
const Product = require('../models')
const ProductPrices = require('@registers/productPrices/models')
const UnitOfMeasure = require('@catalogs/unitsOfMeasure/models')
const { Op, Sequelize } = require('sequelize')

module.exports = {
  async findAll(req, res, next) {
    let filter = JSON.parse(req.query.filter || '{}')
    const pagination = JSON.parse(req.query.pagination || '{}')
    const sort = JSON.parse(req.query.sort || '{}')
    const lang = req.query.lang

    const needTranslate = lang && lang !== 'pl'

    if (filter.searchStr) {
      filter[Op.or] = [{ name: { [Op.iLike]: `%${filter.searchStr}%` } }, { article: { [Op.iLike]: `%${filter.searchStr}%` } }]
      delete filter.searchStr
    }

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
        model: UnitOfMeasure,
        attributes: ['id', 'name'],
        as: 'unitOfMeasure',
      },
    ]

    let items = null

    if (pagination.page) {
      let limit = pagination.limit
      let offset = 0 + (pagination.page - 1) * limit
      items = await ObjectModel.findAndCountAll({
        where: filter,
        offset: offset,
        limit: limit,
        include,
        order,
      })
    } else {
      items = await ObjectModel.findAll({
        where: filter,
        include,
        order,
      })
    }

    if (items) {
      items = JSON.stringify(items)
      items = JSON.parse(items)

      res.status(200).send(items)
    } else {
      console.error(err)
      res.status(400).send({
        message: 'Bad request',
      })
    }
  },

  async findById(req, res, next) {
    const existProduct = await Product.findByPk(req.params.id, { include: [{ model: ProductPrices, as: 'prices' }] })

    if (existProduct) {
      res.status(200).send(existProduct)
    } else {
      res.status(400).send({ message: 'Produkt nie znaleziony' })
    }
  },

  async create(req, res) {
    const objectData = req.body

    if (!objectData.uuid) {
      objectData.uuid = uuidlib.v4()
    }

    if (objectData.presentation) {
      delete objectData.presentation
    }

    await Product.create(objectData)
      .then(async (newProduct) => {
        res.status(httpStatus.StatusCodes.OK).send(newProduct)
      })
      .catch((err) => {
        console.error(err)
        res.status(httpStatus.StatusCodes.BAD_REQUEST).send({ message: 'Product is not created' })
      })
  },

  async update(req, res, next) {
    const existProduct = await Product.findByPk(req.params.id)

    if (existProduct) {
      const objectData = req.body

      if (objectData.presentation) {
        delete objectData.presentation
      }

      await existProduct
        .update(objectData)
        .then((updatedProduct) => {
          res.status(200).send(updatedProduct)
        })
        .catch((err) => {
          res.status(400).send({ message: 'błąd wewnętrzny' })
        })
    } else {
      res.status(400).send({ message: 'Produkt nie znaleziony' })
    }
  },

  async changeDeletionMark(req, res, next) {
    const existItem = await Product.findByPk(req.body.id)

    if (existItem) {
      const objectData = {
        id: req.body.id,
        markedToDelete: !existItem.markedToDelete,
      }

      await existItem
        .update(objectData)
        .then((updatedItem) => {
          res.status(200).send(updatedItem)
        })
        .catch((err) => {
          res.status(400).send({ message: 'Błąd wewnętrzny' })
        })
    } else {
      res.status(400).send({ message: `${objectDescription} not found` })
    }
  },

  async getPrice(req, res, next) {
    const filter = { ...req.body }

    await ProductPrices.findAll({
      where: {
        productId: filter.productId,
        priceType: filter.priceType,
        date: { [Op.lte]: filter.date },
      },
      attributes: ['price'],
      order: [['date', 'DESC']],
    })
      .then((result) => {
        if (result.length > 0) {
          res.status(200).send({ price: result[0].price })
        } else {
          res.status(200).send({ price: 0 })
        }
      })
      .catch((err) => {
        console.error(err)
        res.status(400).send({ message: 'Błąd pobierania ceny' })
      })
  },
}
