const documentsService = require('@services/documentsService')
const exchangeObjectService = require('@services/exchangeObjectService')
const httpStatus = require('http-status-codes')
const logger = require('@logging/logger')
const itemModel = require('../models/reclamation')
const uuidlib = require('uuid')

const reclamationStatusModel = require('@catalogs/reclamationStatuses/models')
const reclamationTypeModel = require('@catalogs/reclamationTypes/models')
const reclamationExecutionModel = require('@catalogs/reclamationExecutionTypes/models')
const reclamationDecisionModel = require('@catalogs/reclamationDecisions/models')

const reclamationSubjectModel = require('@catalogs/reclamationSubjects/models')
const ReclamationPerpetratorModel = require('@catalogs/reclamationPerpetrator/models')

const reclamationItemsModel = require('@documents/reclamations/models/reclamationItem')
const reclamationProductionOrderModel = require('@documents/reclamations/models/reclamationProductionOrder')

const userModel = require('@catalogs/users/models')
const ReclamationReason = require('@catalogs/reclamationReasons/models')
const ReclamationDecisionModel = require('@catalogs/reclamationDecisions/models')

const EmployeeModel = require('@catalogs/employees/models')
const UserModel = require('@catalogs/users/models')

const customerModel = require('@catalogs/counterparties/models')
const roleGroupUserModel = require('@catalogs/roleGroups/models/roleGroupUser')

const documentNumeratorController = require('@registers/documentNumerators/controllers')
const catalogsService = require('@services/catalogsService')
const _ = require('lodash')

const moment = require('moment')

const { Op } = require('sequelize')
const { findById } = require('../../dispositions/controllers')
const { sequelize } = require('../models/reclamation')

const zeroPad = (num, places) => String(num).padStart(places, '0')

const getSalesPointsFilterArray = async (req) => {
  const clientsFilterArray = []
  let allClientsAccess = true

  if (req.user) {
    const currentUserId = req.user.id
    allClientsAccess = req.user.useCustomerAccess === false
  }

  return {
    allClientsAccess,
    salesPointsFilter: clientsFilterArray,
  }
}

module.exports = {
  async getSalesPointsFilterArrayAtServer(req) {
    const res = await getSalesPointsFilterArray(req)
    return res
  },

  async create(req, res) {
    const objectData = { ...req.body }
    objectData.uuid = uuidlib.v4()

    let possitions = undefined
    if (objectData.pendingPossitions) {
      possitions = objectData.pendingPossitions
      delete objectData.pendingPossitions
    }

    if (!objectData.number) {
      const today = new Date()
      const lastNumber = await itemModel.max('number', {
        where: sequelize.literal("split_part(\"number\", '/', '2') = '" + today.getFullYear() + "'"),
      })

      if (lastNumber) {
        let newNumber = parseInt(lastNumber.split('/')[0]) + 1
        const numberLength = newNumber.toString().length
        let completion = ''
        if (numberLength < 5) {
          for (let i = 5; i > numberLength; i--) {
            completion = completion + '0'
          }
          newNumber = completion + newNumber + '/' + today.getFullYear()
          objectData.number = newNumber
        }
      } else {
        objectData.number = '00001/' + today.getFullYear()
      }
    }

    await itemModel
      .create(objectData)
      .then(async (newItem) => {
        for (let i = 0; i < possitions.length; i++) {
          const saveObject = {
            id: possitions[i].id,
            kwatera: possitions[i].kwatera,
            comment: possitions[i].comment,
            quantity: possitions[i].quantity,
            possitionWh: possitions[i].possitionWh,
            reclamationId: newItem.id,
            executionTypeId: possitions[i]._reclamationExecutionType ? possitions[i]._reclamationExecutionType.id : undefined,
            reclamationReasonId: possitions[i]._reclamationReason ? possitions[i]._reclamationReason.id : undefined,
            reclamationSubjectId: possitions[i]._reclamationSubject ? possitions[i]._reclamationSubject.id : undefined,
            reclamationDecisionId: possitions[i]._reclamationDecision ? possitions[i]._reclamationDecision.id : undefined,
            reclamationPerpetratorId: possitions[i]._perpetrator ? possitions[i]._perpetrator.id : undefined,
            reclamationClientDemandId: possitions[i]._clientDemand ? possitions[i]._clientDemand.id : undefined,
          }

          await reclamationItemsModel.create(saveObject)
        }

        const exchangeData = {
          objectId: newItem.id,
          objectName: 'reclamation',
          objectDescription: getDocumentPresentation(newItem),
          sent: false,
          changeType: 0,
        }

        await exchangeObjectService.registerToExchange(exchangeData)

        if (newItem) {
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

  async getAllItems(req, res, next) {
    const filter = JSON.parse(req.query.filter || '{}')
    const statusFilter = JSON.parse(req.query.statusgroupfilter || '{}')

    let statusGroupFilter = null
    if (statusFilter.statusgroupid) {
      let statusGroupArray = []
      if (Array.isArray(statusFilter.statusgroupid)) {
        statusGroupArray = _.cloneDeep(statusFilter.statusgroupid)
      } else {
        statusGroupArray.push(statusFilter.statusgroupid)
      }
      statusGroupFilter = { statusgroupid: { [Op.in]: statusGroupArray } }
    }

    const pagination = JSON.parse(req.query.pagination || '{}')
    const sort = JSON.parse(req.query.sort || '{}')

    const salesPointsFilterRes = await getSalesPointsFilterArray(req)

    if (filter.searchStr) {
      filter[Op.or] = [
        { salesReference: { [Op.like]: `%${filter.searchStr}%` } },
        { salesRequest: { [Op.like]: `%${filter.searchStr}%` } },
        { salesOrder: { [Op.like]: `%${filter.searchStr}%` } },
        { email: { [Op.like]: `%${filter.searchStr}%` } },
        { number: { [Op.like]: `%${filter.searchStr}%` } },
      ]
      delete filter.searchStr
    }

    if (filter.period) {
      const dateFrom = filter.period[0]
      const dateTo = moment(filter.period[1]).endOf('day').toISOString()
      filter.createdAt = { [Op.between]: [dateFrom, dateTo] }
      delete filter.period
    }

    let order = []
    if (sort.sortBy) {
      let sortItem = sort.sortBy.split('.')
      if (sort.sortDesc === true) {
        sortItem.push('DESC')
      }
      order.push(sortItem)

      if (sort.sortBy === 'number') {
        if (sort.sortDesc === true) {
          order = sequelize.literal("split_part(\"number\", '/', '2') desc, split_part(\"number\", '/', '1') desc")
        } else {
          order = sequelize.literal("split_part(\"number\", '/', '2') asc, split_part(\"number\", '/', '1') asc")
        }
      }
    } else {
      order = sequelize.literal("split_part(\"number\", '/', '2') desc, split_part(\"number\", '/', '1') desc")
    }

    let reclamations = null

    const itemsInclude = [
      {
        model: reclamationSubjectModel,
        as: '_reclamationSubject',
        attributes: ['id', 'description', 'code'],
      },
      {
        model: reclamationExecutionModel,
        as: '_reclamationExecutionType',
        attributes: ['id', 'description'],
      },
      {
        model: reclamationDecisionModel,
        as: '_reclamationDecision',
        attributes: ['id', 'description'],
      },
      {
        model: ReclamationPerpetratorModel,
        as: '_perpetrator',
        attributes: ['id', 'description'],
      },
      {
        model: ReclamationReason,
        as: '_reclamationReason',
        attributes: ['id', 'description'],
      },
    ]

    const include = [
      {
        model: reclamationStatusModel,
        as: '_status',
        attributes: ['id', 'description', 'color', 'statusgroupid'],
        where: statusGroupFilter,
      },
      {
        model: reclamationTypeModel,
        as: 'docType',
        attributes: ['id', 'description'],
      },
      {
        model: ReclamationReason,
        as: '_reclamationReason',
        attributes: ['id', 'description'],
      },
      {
        model: userModel,
        as: '_responsible',
        attributes: ['id', 'name'],
      },
      {
        model: userModel,
        as: '_executor',
        attributes: ['id', 'name'],
      },
      {
        model: customerModel,
        as: '_customer',
        attributes: ['id', 'name'],
      },
      {
        model: reclamationExecutionModel,
        as: '_execution_type',
        attributes: ['id', 'description'],
      },
      {
        model: reclamationDecisionModel,
        as: '_decision',
        attributes: ['id', 'description'],
      },
      {
        model: reclamationItemsModel,
        as: 'reclamation_items',
        include: itemsInclude,
      },
      {
        model: reclamationProductionOrderModel,
        as: 'prodorder_reclamations',
      },
    ]

    // const attributes = { exclude: ['customerId', 'authorId', 'currencyId', 'statusId'] };
    const attributes = {}

    if (pagination.page) {
      let limit = pagination.limit
      let offset = 0 + (pagination.page - 1) * limit
      reclamations = await itemModel.findAndCountAll({
        where: filter,
        offset: offset,
        limit: limit,
        attributes,
        include,
        order,
      })
    } else {
      reclamations = await itemModel.findAll({
        where: filter,
        attributes,
        include,
        order,
      })
    }

    if (reclamations) {
      reclamations = JSON.stringify(reclamations)
      reclamations = JSON.parse(reclamations)
      res.status(200).send(reclamations)
    } else {
      res.status(200).send('Reclamations not found')
    }
  },

  // async getAllItems(req, res, next) {
  //   let response;

  //   // const salesPointsFilterRes = await getSalesPointsFilterArray(req);

  //   // let salesPointsFilter = {};
  //   // if (salesPointsFilterRes.allClientsAccess === false) {
  //   //   salesPointsFilter = { customer: salesPointsFilterRes.sales_points_filter };
  //   // }

  //   // try {
  //     // let statusGroupFilter = {};
  //     // if (req.query) {
  //     //   if (req.query.where) {
  //     //     let filter = req.query.where;
  //     //     statusGroupFilter = JSON.parse(filter);

  //     //     if (statusGroupFilter.statusgroupid && statusGroupFilter.statusgroupid === 'opened') {
  //     //       statusGroupFilter.statusgroupid = { [Op.ne]: 4 };
  //     //     }
  //     //   }
  //     // }
  //     const includeArray = [
  //       {
  //         model: reclamationStatusModel,
  //         as: '_status',
  //         attributes: ['id', 'description', 'color', 'statusgroupid'],
  //         where: statusGroupFilter,
  //       },

  //       {
  //         model: reclamationTypeModel,
  //         as: '_doc_type',
  //         attributes: ['id', 'description'],
  //       },
  //       {
  //         model: ReclamationReason,
  //         as: '_reclamationReason',
  //         attributes: ['id', 'description'],
  //       },
  //       {
  //         model: userModel,
  //         as: '_responsible',
  //         attributes: ['id', 'name'],
  //       },
  //       {
  //         model: customerModel,
  //         as: '_customer',
  //         attributes: ['id', 'name'],
  //       },
  //       {
  //         model: reclamationExecutionModel,
  //         as: '_execution_type',
  //         attributes: ['id', 'description'],
  //       },
  //       {
  //         model: reclamationDecisionModel,
  //         as: '_decision',
  //         attributes: ['id', 'description'],
  //       },
  //     ];

  //     const orderArray = [
  //       ['inputDate', 'DESC'],
  //       ['numNumber', 'DESC'],
  //     ];

  //     response = await documentsService.findAllItems(itemModel, salesPointsFilter, includeArray, orderArray);
  //     return res.status(response.httpStatus).send(response);
  //   // } catch (err) {
  //   //   logger.error('Error in getAllItems Controller', { meta: err });
  //   //   return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: err });
  //   // }
  // },

  async findById(req, res, next) {
    const itemsInclude = [
      {
        model: reclamationSubjectModel,
        as: '_reclamationSubject',
        attributes: ['id', 'description', 'code'],
      },
      {
        model: reclamationExecutionModel,
        as: '_reclamationExecutionType',
        attributes: ['id', 'description'],
      },
      {
        model: reclamationDecisionModel,
        as: '_reclamationDecision',
        attributes: ['id', 'description'],
      },
      {
        model: ReclamationPerpetratorModel,
        as: '_perpetrator',
        attributes: ['id', 'description'],
      },
      {
        model: ReclamationReason,
        as: '_reclamationReason',
        attributes: ['id', 'description'],
      },
    ]

    const include = [
      {
        model: reclamationStatusModel,
        as: '_status',
        attributes: ['id', 'description', 'color'],
      },
      {
        model: reclamationTypeModel,
        as: 'docType',
        attributes: ['id', 'description'],
      },
      {
        model: reclamationExecutionModel,
        as: '_execution_type',
        attributes: ['id', 'description'],
      },
      {
        model: EmployeeModel,
        as: 'manager',
        attributes: ['id', 'name'],
      },
      {
        model: UserModel,
        as: '_responsible',
        attributes: ['id', 'name'],
      },
      {
        model: UserModel,
        as: '_executor',
        attributes: ['id', 'name'],
      },
      {
        model: UserModel,
        as: '_author',
        attributes: ['id', 'name'],
      },
      {
        model: ReclamationPerpetratorModel,
        as: '_perpetrator',
        attributes: ['id', 'description'],
      },
      {
        model: ReclamationDecisionModel,
        as: '_decision',
        attributes: ['id', 'description'],
      },
      {
        model: customerModel,
        as: '_customer',
        attributes: ['id', 'name'],
      },
      {
        model: reclamationItemsModel,
        as: 'reclamation_items',
        include: itemsInclude,
      },
    ]

    const existProduct = await itemModel.findByPk(req.params.id, {
      include,
    })

    if (existProduct) {
      res.status(200).send(existProduct)
    } else {
      res.status(400).send({ message: 'Produkt nie znaleziony' })
    }
  },

  async updateItem(req, res, next) {
    const existItem = await itemModel.findByPk(req.params.id)

    if (existItem) {
      const objectData = { ...req.body }
      delete objectData.presentation

      if (!objectData.maxDecrease || objectData.maxDecrease === null) {
        objectData.maxDecrease = 0
      }
      await existItem
        .update(objectData)
        .then(async (updatedItem) => {
          const exchangeData = {
            objectId: updatedItem.id,
            objectName: 'reclamation',
            objectDescription: getDocumentPresentation(updatedItem),
            sent: false,
            changeType: 1,
          }

          await exchangeObjectService.registerToExchange(exchangeData)

          // const changesData = {
          //   objectId: updatedItem.id,
          //   objectName: 'deliveryNote',
          //   description: 'Zmieniono',
          // }
          // await objectVersionsService.addChanges(changesData, req)

          res.status(200).send(updatedItem)
        })
        .catch((err) => {
          console.error(err)
          res.status(400).send({ message: 'Błąd wewnętrzny' })
        })
    } else {
      res.status(400).send({ message: /*`${objectDescription} not found`*/ 'd' })
    }
  },

  async deleteItem(req, res, next) {
    let response
    try {
      response = await documentsService.deleteItem(itemModel, req.body.id)
      return res.status(response.httpStatus).send(response)
    } catch (err) {
      logger.error('Error in deleteItem Controller', { meta: err })
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: err })
    }
  },
}

function getDocumentPresentation(documentData) {
  const createdAt = moment(documentData.createdAt).format('DD MM YYYY HH:mm:ss')
  return `Reklamacja nr ${documentData.numberStr} od ${createdAt}`
}

const operatorsMap = {
  // Add additional operators as needed.
  $ne: Op.ne,
}

async function replaceOperators(oldObject) {
  let newObject = {}
  for (let key in oldObject) {
    let value = oldObject[key]

    if (typeof value === 'object') {
      newObject[key] = await replaceOperators(value) // Recurse
    } else if (this.operatorsMap[key]) {
      let op = this.operatorsMap[key]
      newObject[op] = value
    } else {
      newObject[key] = value
    }
  }

  return newObject
}
