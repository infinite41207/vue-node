const ObjectModel = require('../models/index')
const objectDescription = 'DeliveryOrder'
const ModelService = require('../service')
const exchangeObjectService = require('@services/exchangeObjectService')
const objectVersionsService = require('@services/objectVersionsService')
const { Op, Sequelize } = require('sequelize')

const User = require('@catalogs/users/models')
const Counterparty = require('@catalogs/counterparties/models')
const SchemeOfCargo = require('@catalogs/schemesOfCargo/models')
const Warehouse = require('@catalogs/warehouses/models')
const Box = require('@catalogs/boxes/models')
const VendorAndCustomer = require('@catalogs/vendorsAndCustomers/models')
const Ship = require('@catalogs/ships/models')
const Product = require('@catalogs/products/models')
const ControlCompany = require('@catalogs/controlCompanies/models')
const Scale = require('@catalogs/scales/models')
const WeighingStation = require('@catalogs/weighingStations/models')
const Assortment = require('@catalogs/assortments/models')
const Dysposition = require('@documents/dispositions/models')
const moment = require('moment')

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
    let schemeOfCargoFilter = {}

    if (filter.schemeOfCargoId) {
      schemeOfCargoFilter = { id: filter.schemeOfCargoId }
      delete filter.schemeOfCargo
    }

    let counterpartyFilter = {}

    if (filter.counterpartyId) {
      counterpartyFilter = { id: filter.counterpartyId }
      delete filter.counterparty
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
        model: SchemeOfCargo,
        where: schemeOfCargoFilter,
        attributes: ['id', 'name'],
        as: 'schemeOfCargo',
      },
      {
        model: Counterparty,
        where: counterpartyFilter,
        attributes: ['id', 'name'],
        as: 'owner',
      },
      {
        model: Product,
        attributes: ['id', 'name'],
        as: 'product',
      },
      {
        model: Warehouse,
        attributes: ['id', 'name'],
        as: 'warehouse',
      },
      {
        model: Ship,
        attributes: ['id', 'name'],
        as: 'ship',
      },
      {
        model: ControlCompany,
        attributes: ['id', 'name'],
        as: 'controlCompany',
      },
      {
        model: ObjectModel,
        attributes: ['id', 'number'],
        as: 'base',
      },
      {
        model: Assortment,
        attributes: ['id', 'name'],
        as: 'assortment',
      },
      {
        model: WeighingStation,
        attributes: ['id', 'name'],
        as: 'weighingStation',
      },
      {
        model: WeighingStation,
        attributes: ['id', 'name'],
        as: 'weighingStation',
      },
      {
        model: Scale,
        attributes: ['id', 'name'],
        as: 'scale',
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
        offset,
        limit,
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
        model: SchemeOfCargo,
        attributes: ['id', 'name'],
        as: 'schemeOfCargo',
      },
      {
        model: Counterparty,
        attributes: ['id', 'name'],
        as: 'owner',
      },
      {
        model: Product,
        attributes: ['id', 'name'],
        as: 'product',
      },
      {
        model: Warehouse,
        attributes: ['id', 'name'],
        as: 'warehouse',
      },
      {
        model: Ship,
        attributes: ['id', 'name'],
        as: 'ship',
      },
      {
        model: Box,
        attributes: ['id', 'name'],
        as: 'box',
      },
      {
        model: VendorAndCustomer,
        attributes: ['id', 'name'],
        as: 'forwarder',
      },
      {
        model: ObjectModel,
        attributes: ['id', 'number'],
        as: 'base',
      },
      {
        model: ControlCompany,
        attributes: ['id', 'name'],
        as: 'controlCompany',
      },
      {
        model: Assortment,
        attributes: ['id', 'name'],
        as: 'assortment',
      },
      {
        model: WeighingStation,
        attributes: ['id', 'name'],
        as: 'weighingStation',
      },
      {
        model: Scale,
        attributes: ['id', 'name'],
        as: 'scale',
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

    await ModelService.setNumbers(objectData)

    if (objectData.presentation) {
      delete objectData.presentation
    }
    if (!objectData.maxDecrease || objectData.maxDecrease === null) {
      objectData.maxDecrease = 0
    }
    await ObjectModel.create(objectData)
      .then(async (newItem) => {
        if (newItem) {
          const exchangeData = {
            objectId: newItem.id,
            objectName: 'deliveryNote',
            objectDescription: getDocumentPresentation(newItem),
            sent: false,
            changeType: 0,
          }
          await exchangeObjectService.registerToExchange(exchangeData)

          const changesData = {
            objectId: newItem.id,
            objectName: 'deliveryNote',
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
      if (objectData.presentation) {
        delete objectData.presentation
      }

      if (!objectData.maxDecrease || objectData.maxDecrease === null) {
        objectData.maxDecrease = 0
      }
      await existItem
        .update(objectData)
        .then(async (updatedItem) => {
          const exchangeData = {
            objectId: updatedItem.id,
            objectName: 'deliveryNote',
            objectDescription: getDocumentPresentation(updatedItem),
            sent: false,
            changeType: 1,
          }
          await exchangeObjectService.registerToExchange(exchangeData)

          const changesData = {
            objectId: updatedItem.id,
            objectName: 'deliveryNote',
            description: 'Zmieniono',
          }
          await objectVersionsService.addChanges(changesData, req)

          res.status(200).send(updatedItem)
        })
        .catch((err) => {
          console.error(err)
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

  async getSubordination(req, res) {
    let subordination = []

    let currObjectData

    const currentObject = await ObjectModel.findByPk(req.params.id, {
      attributes: ['id', 'number', 'numberStr', 'createdAt', 'presentation', 'markedToDelete'],
    })

    if (currentObject) {
      const orderDispositions = await Dysposition.findAll({ where: { orderId: currentObject.id } })

      const childrenDispositions = []
      if (orderDispositions) {
        for (let disposition of orderDispositions) {
          childrenDispositions.push({
            objectId: disposition.id,
            objectType: 'dispositions',
            detailRoute: { name: 'disposition-form', params: { id: disposition.id } },
            text: disposition.presentation,
            markedToDelete: disposition.markedToDelete,
            icon: disposition.markedToDelete === true ? 'ri-file-reduce-line text-danger' : 'ri-file-text-fill text-info tree-icon',
            opened: true,
            disabled: false,
            children: [],
          })
        }
      }

      currObjectData = {
        objectId: currentObject.id,
        objectType: 'deliveryOrders',
        detailRoute: { name: 'delivery-order-detail', params: { id: currentObject.id } },
        text: currentObject.presentation,
        markedToDelete: currentObject.markedToDelete,
        icon: currentObject.markedToDelete === true ? 'ri-file-reduce-line text-danger' : 'ri-file-text-fill text-info tree-icon',
        opened: true,
        disabled: true,
        children: childrenDispositions,
      }
    }

    if (currObjectData) {
      subordination.push(currObjectData)
    }

    res.status(200).send(subordination)
  },
}

function getDocumentPresentation(documentData) {
  const createdAt = moment(documentData.createdAt).format('DD MM YYYY HH:mm:ss')
  return `Zlecenie nr ${documentData.numberStr} od ${createdAt}`
}
