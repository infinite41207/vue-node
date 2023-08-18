const ObjectModel = require('../models/paymentOperation')
const uuidlib = require('uuid')
const objectDescription = 'PaymentOperation'
const ModelService = require('../service')
const exchangeObjectService = require('@services/exchangeObjectService')
const objectVersionsService = require('@services/objectVersionsService')

const Enums = require('@enums')

const User = require('@catalogs/users/models')
const Currency = require('@catalogs/currencies/models')
const PaymentType = require('@catalogs/paymentTypes/models')
const CashFlowItem = require('@catalogs/cashFlowItems/models')
const Project = require('@catalogs/projects/models')

const moment = require('moment')
const { Op, Sequelize } = require('sequelize')


module.exports = {
  async findAll(req, res, next) {
    const filter = JSON.parse(req.query.filter || '{}')
    const pagination = JSON.parse(req.query.pagination || '{}')
    const sort = JSON.parse(req.query.sort || '{}')

    if (filter.searchStr) {
      filter.numberStr = {
        [Op.iLike]: `%${filter.searchStr}%`,
      }
      delete filter.searchStr
    }
    if (filter.period) {
      const dateFrom = filter.period[0]
      const dateTo = moment(filter.period[1]).endOf('day').toISOString()

      filter.date = { [Op.between]: [dateFrom, dateTo] }
      delete filter.period
    }

    let order = []
    if (sort.sortBy) {
      let sortItem = sort.sortBy.split('.')
      if (sort.sortDesc === true) {
        sortItem.push('DESC')
      }
      order.push(sortItem)
    }

    order.push(['createdAt'])

    const include = [
      {
        model: PaymentType,
        attributes: ['id', 'name', 'type'],
        as: 'paymentType',
      },
      {
        model: CashFlowItem,
        attributes: ['id', 'name'],
        as: 'cashFlowItem',
      },
      {
        model: Project,
        attributes: ['id', 'name'],
        as: 'project',
      },
      {
        model: Currency,
        attributes: ['id', 'name'],
        as: 'currency',
      },
      {
        model: User,
        attributes: ['id', 'name'],
        as: 'author',
      },
    ]

    if (pagination.page) {
      let limit = pagination.limit
      let offset = 0 + (pagination.page - 1) * limit
      items = await ObjectModel.findAndCountAll({
        where: filter,
        offset: offset,
        limit: limit,
        order,
        include,
      })
    } else {
      items = await ObjectModel.findAll({
        where: filter,
        order,
        include,
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
    const include = [
      {
        model: PaymentType,
        attributes: ['id', 'name'],
        as: 'paymentType',
      },
      {
        model: CashFlowItem,
        attributes: ['id', 'name'],
        as: 'cashFlowItem',
      },
      {
        model: Project,
        attributes: ['id', 'name'],
        as: 'project',
      },
      {
        model: Currency,
        attributes: ['id', 'name'],
        as: 'currency',
      },
      {
        model: User,
        attributes: ['id', 'name'],
        as: 'author',
      },
    ]

    let item = await ObjectModel.findByPk(req.params.id, {
      include,
    })

    if (item) {
      res.status(200).send(item)
    } else {
      res.status(400).send({ message: `${objectDescription} not found` })
    }
  },

  async create(req, res) {
    const objectData = { ...req.body }
    objectData.uuid = uuidlib.v4()

    await ModelService.setNumbers(objectData)

    await ObjectModel.create(objectData)
      .then(async (newItem) => {
        if (newItem) {
          const exchangeData = {
            objectId: newItem.id,
            objectName: 'paymentOperation',
            objectDescription: getDocumentPresentation(newItem),
            sent: false,
            changeType: 0,
          }
          await exchangeObjectService.registerToExchange(exchangeData)

          const changesData = {
            objectId: newItem.id,
            objectName: 'paymentOperation',
            description: 'Stworzono',
          }
          await objectVersionsService.addChanges(changesData, req)

          res.status(200).send(newItem)
        } else {
          res.status(400).send({ message: `${objectDescription} is not created` })
        }
      })
      .catch((err) => {
        console.error(err)
        res.status(400).send({ message: `${objectDescription} is not created` })
      })
  },

  async update(req, res, next) {
    const existItem = await ObjectModel.findByPk(req.params.id)

    if (existItem) {
      const objectData = { ...req.body }
      await existItem
        .update(objectData)
        .then(async (updatedItem) => {
          const exchangeData = {
            objectId: updatedItem.id,
            objectName: 'paymentOperation',
            objectDescription: getDocumentPresentation(updatedItem),
            sent: false,
            changeType: 1,
          }
          await exchangeObjectService.registerToExchange(exchangeData)

          const changesData = {
            objectId: updatedItem.id,
            objectName: 'paymentOperation',
            description: 'Zmieniono',
          }
          await objectVersionsService.addChanges(changesData, req)

          res.status(200).send(updatedItem)
        })
        .catch((err) => {
          res.status(400).send({ message: 'Błąd wewnętrzny' })
        })
    } else {
      res.status(400).send({ message: `${objectDescription} not found` })
    }
  },

  async changeDeletionMark(req, res, next) {
    const existItem = await ObjectModel.findByPk(req.body.id)

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

  async delete(req, res, next) {
    const existItem = await ObjectModel.findByPk(req.params.id)

    if (existItem) {
      await existItem
        .destroy(req.params.id)
        .then(() => {
          res.status(200).send({ message: 'OK' })
        })
        .catch((err) => {
          res.status(400).send({ message: 'Błąd wewnętrzny' })
        })
    } else {
      res.status(400).send({ message: `${objectDescription} not found` })
    }
  },

}

function getDocumentPresentation(documentData) {
  const createdAt = moment(documentData.createdAt).format('DD MM YYYY HH:mm:ss')
  return `Operacja płatnicza nr ${documentData.numberStr} od ${createdAt}`
}
