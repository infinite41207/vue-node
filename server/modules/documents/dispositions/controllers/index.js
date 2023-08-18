const ObjectModel = require('../models/index')
const uuidlib = require('uuid')
const { Op, Sequelize } = require('sequelize')
const objectDescription = 'Disposition'
const ModelService = require('../service')
const exchangeObjectService = require('@services/exchangeObjectService')
const objectVersionsService = require('@services/objectVersionsService')

const WagonInventoryModel = require('../models/wagonInventory')
const deliveryNoteModel = require('@documents/deliveryNotes/models')
const orderModel = require('@documents/deliveryOrders/models')

const mineModel = require('@catalogs/mines/models')
const positionModel = require('@catalogs/positions/models')
const assortmentModel = require('@catalogs/assortments/models')
const driverModel = require('@catalogs/drivers/models')
const productModel = require('@catalogs/products/models')
const scaleModel = require('@catalogs/scales/models')
const weighingStationModel = require('@catalogs/weighingStations/models')
const schemeOfCargoModel = require('@catalogs/schemesOfCargo/models')
const shipModel = require('@catalogs/ships/models')
const boxModel = require('@catalogs/boxes/models')
const carrierModel = require('@catalogs/carriers/models')
const vehicleModel = require('@catalogs/vehicles/models')
const vendorAndCustomerModel = require('@catalogs/vendorsAndCustomers/models')
const warehouseModel = require('@catalogs/warehouses/models')
const userModel = require('@catalogs/users/models')
const dispositionStatusModel = require('@catalogs/dispositionStatuses/models')

const moment = require('moment')

function getIncludeArray(schemeOfCargoFilter = {}) {
  const includeArray = [
    {
      model: orderModel,
      as: 'order',
      attributes: ['id', 'number', 'numberStr', 'date'],
    },
    {
      model: driverModel,
      as: 'driver',
      attributes: ['id', 'name'],
    },
    {
      model: vehicleModel,
      as: 'vehicle',
      attributes: ['id', 'name'],
    },
    {
      model: boxModel,
      as: 'box',
      attributes: ['id', 'name'],
    },
    {
      model: carrierModel,
      as: 'carrier',
      attributes: ['id', 'name'],
    },
    {
      model: vehicleModel,
      as: 'trailer',
      attributes: ['id', 'name'],
    },
    {
      model: shipModel,
      as: 'ship',
      attributes: ['id', 'name'],
    },
    {
      model: productModel,
      as: 'product',
      attributes: ['id', 'name'],
    },
    {
      model: schemeOfCargoModel,
      where: schemeOfCargoFilter,
      as: 'schemeOfCargo',
      attributes: ['id', 'name', 'reverseOperation', 'disableControlOnScales'],
    },
    {
      model: warehouseModel,
      as: 'warehouse',
      attributes: ['id', 'name'],
    },
    {
      model: warehouseModel,
      as: 'actualWarehouse',
      attributes: ['id', 'name'],
    },
    {
      model: vendorAndCustomerModel,
      as: 'customer',
      attributes: ['id', 'name'],
    },
    {
      model: vendorAndCustomerModel,
      as: 'forwarder',
      attributes: ['id', 'name'],
    },
    {
      model: vendorAndCustomerModel,
      as: 'vendor',
      attributes: ['id', 'name'],
    },
    {
      model: scaleModel,
      as: 'scale',
      attributes: ['id', 'name'],
    },
    {
      model: scaleModel,
      as: 'scaleTwo',
      attributes: ['id', 'name'],
    },
    {
      model: weighingStationModel,
      as: 'weighingStation',
      attributes: ['id', 'name'],
    },
    {
      model: assortmentModel,
      as: 'assortment',
      attributes: ['id', 'name'],
    },
    {
      model: mineModel,
      as: 'mine',
      attributes: ['id', 'name'],
    },
    {
      model: positionModel,
      as: 'position',
      attributes: ['id', 'name'],
    },
    {
      model: userModel,
      as: 'author',
      attributes: ['id', 'name'],
    },
    {
      model: dispositionStatusModel,
      as: 'status',
      attributes: ['id', 'name', 'key', 'color'],
    },
  ]

  return includeArray
}

async function getArrayStatusIds(arrayKeys) {
  let arrayStatusIds = []
  const filter = { key: { [Op.in]: arrayKeys } }
  const response = await dispositionStatusModel.findAll({ where: filter })
  if (response) {
    for (const item of response) {
      arrayStatusIds.push(item.dataValues.id)
    }
  }
  return arrayStatusIds
}

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

    if (filter.state) {
      let arrStates = filter.state
      if (!Array.isArray(arrStates)) {
        arrStates = [arrStates]
      }
      const arrayStatusIds = await getArrayStatusIds(arrStates)
      filter.statusId = { [Op.in]: arrayStatusIds }
      delete filter.state
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

    let items
    if (pagination.page) {
      let limit = pagination.limit
      let offset = 0 + (pagination.page - 1) * limit
      items = await ObjectModel.findAndCountAll({
        where: filter,
        offset: offset,
        limit: limit,
        order,
        include: getIncludeArray(schemeOfCargoFilter),
      })
    } else {
      items = await ObjectModel.findAll({
        where: filter,
        order,
        include: getIncludeArray(schemeOfCargoFilter),
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
    let item = await ObjectModel.findByPk(req.params.id, {
      include: getIncludeArray(),
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

    if (objectData.presentation) {
      delete objectData.presentation
    }
    if (!objectData.maxDecrease || objectData.maxDecrease === null) {
      objectData.maxDecrease = 0
    }

    await setBarCode(objectData)

    await ObjectModel.create(objectData)
      .then(async (newItem) => {
        if (newItem) {
          const exchangeData = {
            objectId: newItem.id,
            objectName: 'disposition',
            objectDescription: getDocumentPresentation(newItem),
            sent: false,
            changeType: 0,
          }
          await exchangeObjectService.registerToExchange(exchangeData)

          const changesData = {
            objectId: newItem.id,
            objectName: 'disposition',
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

      await setBarCode(objectData)

      await existItem
        .update(objectData)
        .then(async (updatedItem) => {
          const exchangeData = {
            objectId: updatedItem.id,
            objectName: 'disposition',
            objectDescription: getDocumentPresentation(updatedItem),
            sent: false,
            changeType: 1,
          }
          await exchangeObjectService.registerToExchange(exchangeData)

          const changesData = {
            objectId: updatedItem.id,
            objectName: 'disposition',
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

  async findFirstWeighting(req, res, next) {
    const arrStates = ['NaTerminalu']
    const arrayStatusIds = await getArrayStatusIds(arrStates)
    if (arrayStatusIds.length === 0) {
      res.status(400).send({
        message: 'Bad request',
      })
      return
    }
    const filter = { statusId: arrayStatusIds }
    const includeArray = getIncludeArray()

    response = await ObjectModel.findAll({ where: filter, include: includeArray })

    if (response) {
      res.status(200).send(response)
    } else {
      res.status(400).send({
        message: 'Bad request',
      })
    }
  },

  async findSecondWeighting(req, res, next) {
    const arrStates = ['Loaded', 'Unloaded', 'RemoveWeight']
    const arrayStatusIds = await getArrayStatusIds(arrStates)
    if (arrayStatusIds.length === 0) {
      res.status(400).send({
        message: 'Bad request',
      })
      return
    }
    const filter = { statusId: { [Op.in]: arrayStatusIds } }
    const includeArray = getIncludeArray()

    response = await ObjectModel.findAll({ where: filter, include: includeArray })

    if (response) {
      res.status(200).send(response)
    } else {
      res.status(400).send({
        message: 'Bad request',
      })
    }
  },

  async getNumberOfWeighted(req, res, next) {
    const filter = req.query
    filter.netto = { [Op.gt]: 0 }

    const result = await deliveryNoteModel.count({ where: filter })

    if (result === null) {
      res.status(400).send({ message: 'Bad request' })
    } else {
      res.status(200).send({ data: result })
    }
  },

  async findByTicket(req, res, next) {
    let existItem
    let response
    const ticketNumber = req.query.ticketNumber
    let arrStates = req.query.arrStates
    if (!arrStates) {
      arrStates = ['NaTerminalu', 'Loaded', 'Unloaded', 'RemoveWeight']
    }
    const arrayStatusIds = await getArrayStatusIds(arrStates)
    if (arrayStatusIds.length === 0) {
      res.status(200).send(undefined)
      return
    }
    const includeArray = getIncludeArray()
    existItem = await ObjectModel.findOne({
      where: {
        statusId: { [Op.in]: arrayStatusIds },
        driverTicket: ticketNumber,
      },
      include: includeArray,
    })

    if (existItem === null) {
      existItem = await ObjectModel.findOne({
        where: {
          statusId: { [Op.in]: arrayStatusIds },
          entryTicket: ticketNumber,
        },
        include: includeArray,
      })
      if (existItem === null) {
        existItem = await ObjectModel.findOne({
          where: {
            statusId: { [Op.in]: arrayStatusIds },
            barCode: ticketNumber,
          },
          include: includeArray,
        })
      }
    }
    if (existItem) {
      res.status(200).send(existItem)
    } else {
      res.status(200).send(undefined)
    }
  },
}

function getDocumentPresentation(documentData) {
  const createdAt = moment(documentData.createdAt).format('DD MM YYYY HH:mm:ss')
  return `Dyspozycja nr ${documentData.numberStr} od ${createdAt}`
}

async function setBarCode(objectData) {
  if (objectData.barCode !== '') {
    return objectData.barCode
  }
  if (objectData.scaleId === null && objectData.weighingStationId === null) {
    return ''
  }

  let scalePrefix = ''
  let weighingStationPrefix = ''

  if (objectData.scaleId !== null) {
    let existItem = await scaleModel.findByPk(objectData.scaleId)
    if (existItem) {
      scalePrefix = existItem.barCodePrefix
    }
  }
  if (objectData.weighingStationId !== null) {
    existItem = await weighingStationModel.findByPk(objectData.weighingStationId)
    if (existItem) {
      weighingStationPrefix = existItem.barCodePrefix
    }
  }

  let barCode = ''
  if (!scalePrefix === '') {
    barCode = scalePrefix
  } else if (!weighingStationPrefix === '') {
    barCode = weighingStationPrefix
  }
  if (!barCode === '') {
    barCode += '-'
  }
  barCode += objectData.numberStr
  objectData.barCode = barCode

  return barCode
}
