const ObjectModel = require('../models/index')
const uuidlib = require('uuid')
const objectDescription = 'DeliveryNote'
const ModelService = require('../service')
const exchangeObjectService = require('@services/exchangeObjectService')
const objectVersionsService = require('@services/objectVersionsService')

const Enums = require('@enums')

const User = require('@catalogs/users/models')
const Box = require('@catalogs/boxes/models')
const VendorAndCustomer = require('@catalogs/vendorsAndCustomers/models')
const Driver = require('@catalogs/drivers/models')
const Product = require('@catalogs/products/models')
const Position = require('@catalogs/positions/models')
const Scale = require('@catalogs/scales/models')
const SchemeOfCargo = require('@catalogs/schemesOfCargo/models')
const Ship = require('@catalogs/ships/models')
const Vehicle = require('@catalogs/vehicles/models')
const Warehouse = require('@catalogs/warehouses/models')
const WeighingStation = require('@catalogs/weighingStations/models')
const Mine = require('@catalogs/mines/models')
const dispositionStatusModel = require('@catalogs/dispositionStatuses/models')

const Disposition = require('@documents/dispositions/models')
const Order = require('@documents/deliveryOrders/models')
const moment = require('moment')

const sequelize = require('@database/dbConnection')
const { QueryTypes, Op, Sequelize } = require('sequelize')

const PhotosWeighting = require('../../../catalogs/scales/models/photoWeighting')

//add photos_weighting

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
        attributes: ['id', 'name', 'reverseOperation'],
        as: 'schemeOfCargo',
      },
      {
        model: Product,
        attributes: ['id', 'name'],
        as: 'product',
      },
      {
        model: Driver,
        attributes: ['id', 'name'],
        as: 'driver',
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
        model: VendorAndCustomer,
        attributes: ['id', 'name'],
        as: 'forwarder',
      },
      {
        model: Vehicle,
        attributes: ['id', 'name'],
        as: 'trailer',
      },
      {
        model: VendorAndCustomer,
        attributes: ['id', 'name'],
        as: 'customer',
      },
      {
        model: Vehicle,
        attributes: ['id', 'name', 'tare', 'loadCapacity'],
        as: 'vehicle',
      },
      {
        model: Disposition,
        as: 'disposition',
        attributes: ['id', 'number', 'numberStr', 'date', 'type'],
        include: [
          {
            model: Order,
            as: 'order',
            attributes: ['id', 'number', 'numberStr', 'date'],
          },
        ],
      },
      {
        model: PhotosWeighting,
        as: 'photosWeightings',
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
        attributes: ['id', 'name', 'reverseOperation'],
        as: 'schemeOfCargo',
      },
      {
        model: Product,
        attributes: ['id', 'name'],
        as: 'product',
      },
      {
        model: Driver,
        attributes: ['id', 'name'],
        as: 'driver',
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
        model: VendorAndCustomer,
        attributes: ['id', 'name'],
        as: 'forwarder',
      },
      {
        model: VendorAndCustomer,
        attributes: ['id', 'name'],
        as: 'customer',
      },
      {
        model: VendorAndCustomer,
        attributes: ['id', 'name'],
        as: 'vendor',
      },
      {
        model: Vehicle,
        attributes: ['id', 'name'],
        as: 'trailer',
      },
      {
        model: Vehicle,
        attributes: ['id', 'name'],
        as: 'vehicle',
      },
      {
        model: Mine,
        attributes: ['id', 'name'],
        as: 'mine',
      },
      {
        model: Position,
        attributes: ['id', 'name'],
        as: 'position',
      },
      {
        model: Box,
        attributes: ['id', 'name'],
        as: 'box',
      },
      {
        model: Scale,
        attributes: ['id', 'name'],
        as: 'scaleBrutto',
      },
      {
        model: Scale,
        attributes: ['id', 'name'],
        as: 'scaleTare',
      },
      {
        model: Scale,
        attributes: ['id', 'name'],
        as: 'scaleNetto',
      },
      {
        model: User,
        attributes: ['id', 'name'],
        as: 'tareAuthor',
      },
      {
        model: User,
        attributes: ['id', 'name'],
        as: 'nettoAuthor',
      },
      {
        model: User,
        attributes: ['id', 'name'],
        as: 'bruttoAuthor',
      },
      {
        model: User,
        attributes: ['id', 'name'],
        as: 'approvedAuthor',
      },
      {
        model: Disposition,
        attributes: ['id', 'number', 'numberStr'],
        as: 'disposition',
      },
      {
        model: PhotosWeighting,
        as: 'photosWeightings',
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

    console.log('objectData = ', objectData)

    objectData.uuid = uuidlib.v4()

    prepareDataBeforeWrite(objectData)

    await ModelService.setNumbers(objectData)

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

  async findForWeighting(req, res, next) {
    const filter = {
      dispositionId: req.query.dispositionId,
      // netto: 0,
      markedToDelete: false,
      cancelWeighting: false,
    }
    if (!(req.query.dispositionStatusKey && req.query.dispositionStatusKey === 'Closed')) {
      filter.netto = 0
    }

    const includeArray = [
      {
        model: SchemeOfCargo,
        attributes: ['id', 'name', 'reverseOperation'],
        as: 'schemeOfCargo',
      },
      {
        model: Product,
        attributes: ['id', 'name'],
        as: 'product',
      },
      {
        model: Driver,
        attributes: ['id', 'name'],
        as: 'driver',
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
        model: VendorAndCustomer,
        attributes: ['id', 'name'],
        as: 'forwarder',
      },
      {
        model: VendorAndCustomer,
        attributes: ['id', 'name'],
        as: 'customer',
      },
      {
        model: VendorAndCustomer,
        attributes: ['id', 'name'],
        as: 'vendor',
      },
      {
        model: Vehicle,
        attributes: ['id', 'name'],
        as: 'trailer',
      },
      {
        model: Vehicle,
        attributes: ['id', 'name'],
        as: 'vehicle',
      },
      {
        model: Mine,
        attributes: ['id', 'name'],
        as: 'mine',
      },
      {
        model: Position,
        attributes: ['id', 'name'],
        as: 'position',
      },
      {
        model: Box,
        attributes: ['id', 'name'],
        as: 'box',
      },
      {
        model: Scale,
        attributes: ['id', 'name'],
        as: 'scaleBrutto',
      },
      {
        model: Scale,
        attributes: ['id', 'name'],
        as: 'scaleTare',
      },
      {
        model: Scale,
        attributes: ['id', 'name'],
        as: 'scaleNetto',
      },
      {
        model: User,
        attributes: ['id', 'name'],
        as: 'tareAuthor',
      },
      {
        model: User,
        attributes: ['id', 'name'],
        as: 'nettoAuthor',
      },
      {
        model: User,
        attributes: ['id', 'name'],
        as: 'bruttoAuthor',
      },
      {
        model: User,
        attributes: ['id', 'name'],
        as: 'approvedAuthor',
      },
      {
        model: Disposition,
        attributes: ['id', 'number', 'numberStr'],
        as: 'disposition',
      },
      {
        model: PhotosWeighting,
        as: 'photosWeightings',
      },
    ]

    const existItem = await ObjectModel.findOne({ where: filter, include: includeArray, order: [['date', 'DESC']] })
    if (existItem) {
      res.status(200).send(existItem)
    } else {
      res.status(400).send(null)
    }
  },

  async findLastTare(req, res, next) {
    const filter = {
      dispositionId: req.params.dispositionId,
      markedToDelete: false,
      cancelWeighting: false,
      tareTime: { [Op.not]: null },
    }

    const existItem = await ObjectModel.findOne({ where: filter, order: [['tareTime', 'DESC']] })
    if (existItem) {
      console.log('getLastTareOfReversOperation = ', existItem)
      res.status(200).send({
        tare: Number(existItem.dataValues.tare),
        tareTime: existItem.dataValues.tareTime,
        tareAuthorId: existItem.dataValues.tareAuthorId,
        tareScaleId: existItem.dataValues.scaleTareId,
      })
    } else {
      res.status(200).send({ tare: 0, tareTime: null, tareAuthorId: null, tareScaleId: null })
    }
  },

  async findByDeliveryOrder(req, res, next) {
    const filter = JSON.parse(req.query.filter || '{}')
    // const include = {
    //   model: Disposition,
    //   as: "disposition",
    //   attributes: ["id"],
    //   include: {
    //     model: Order,
    //     as: "order",
    //     attributes: ["id"],
    //     where: filter,
    //   },
    // };
    // items = await ObjectModel.findAll({ include: include });

    let queryText =
      '\
      SELECT \
        delivery_notes.id, \
        delivery_notes.date AS date, \
        delivery_notes."numberStr" AS "numberStr", \
        delivery_notes.netto AS netto \
      FROM \
        delivery_notes as delivery_notes \
        left join dispositions as dispositions \
        on delivery_notes."dispositionId" = dispositions.id \
      WHERE \
        dispositions."orderId" = :orderId'
    const replacements = { orderId: filter.orderId }
    const items = await sequelize.query(queryText, { type: QueryTypes.SELECT, replacements })

    if (items) {
      res.status(200).send(items)
    } else {
      console.error(err)
      res.status(400).send({
        message: 'Bad request',
      })
    }
  },
}

function prepareDataBeforeWrite(objectData) {
  if (objectData.presentation) {
    delete objectData.presentation
  }
  if (objectData.author) objectData.authorId = objectData.author.id
  if (objectData.warehouse) objectData.warehouseId = objectData.warehouse.id
  if (objectData.box) objectData.boxId = objectData.box.id
  if (objectData.bruttoAuthor) objectData.bruttoAuthorId = objectData.bruttoAuthor.id
  if (objectData.customer) objectData.customerId = objectData.customer.id
  if (objectData.disposition) objectData.dispositionId = objectData.disposition.id
  if (objectData.driver) objectData.driverId = objectData.driver.id
  if (objectData.forwarder) objectData.forwarderId = objectData.forwarder.id
  if (objectData.product) objectData.productId = objectData.product.id
  if (objectData.nettoAuthor) objectData.nettoAuthorId = objectData.nettoAuthor.id
  if (objectData.position) objectData.positionId = objectData.position.id
  if (objectData.scaleBrutto) objectData.scaleBruttoId = objectData.scaleBrutto.id
  if (objectData.scaleTare) objectData.scaleTareId = objectData.scaleTare.id
  if (objectData.scaleNetto) objectData.scaleNettoId = objectData.scaleNetto.id
  if (objectData.schemeOfCargo) objectData.schemeOfCargoId = objectData.schemeOfCargo.id
  if (objectData.ship) objectData.shipId = objectData.ship.id
  if (objectData.tareAuthor) objectData.tareAuthorId = objectData.tareAuthor.id
  if (objectData.vehicle) objectData.vehicleId = objectData.vehicle.id
  if (objectData.trailer) objectData.trailerId = objectData.trailer.id
  if (objectData.vendor) objectData.vendorId = objectData.vendor.id
  if (objectData.approvedAuthor) objectData.approvedAuthorId = objectData.approvedAuthor.id
  if (objectData.mine) objectData.mineId = objectData.mine.id
}

function getDocumentPresentation(documentData) {
  const createdAt = moment(documentData.createdAt).format('DD MM YYYY HH:mm:ss')
  return `List przewozowy nr ${documentData.numberStr} od ${createdAt}`
}
