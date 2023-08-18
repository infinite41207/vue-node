const Object = require('../models/index')
const uuidlib = require('uuid')
const objectDescription = 'Box'
const { Op, Sequelize } = require('sequelize')
const commonService = require('@services/commonService')

const CounterpartiesModel = require('@catalogs/counterparties/models')
const projectModel = require('@catalogs/projects/models')
const userModel = require('@catalogs/users/models')
const employeeModel = require('@catalogs/employees/models')
const interactionModel = require('../../interactions/models/index')
const EventStatusModel = require('@catalogs/eventStatuses/models')
const EventTypeModel = require('@catalogs/eventTypes/models')

function getInclude(schemeOfCargoFilter = {}) {
  const include = [
    {
      model: CounterpartiesModel,
      as: 'counterparty',
      attributes: ['id', 'name'],
    },
    {
      model: projectModel,
      as: 'project',
      attributes: ['id', 'name'],
    },
    {
      model: userModel,
      as: 'author',
      attributes: ['id', 'name'],
    },
    {
      model: employeeModel,
      as: 'employee',
      attributes: ['id', 'name'],
    },
    {
      model: interactionModel,
      as: 'interaction',
      attributes: ['id', 'number'],
    },
    {
      model: EventTypeModel,
      as: 'eventType',
      attributes: ['id', 'name'],
    },
    {
      model: EventStatusModel,
      as: 'eventStatus',
      attributes: ['id', 'name'],
    },
  ]

  return include
}

module.exports = {
  async findAll(req, res, next) {
    commonService.findAllItems(req, res, next, Object, { include: getInclude() })
  },

  async findById(req, res, next) {
    commonService.findItem(req, res, next, Object, { include: getInclude() })
  },

  async create(req, res, next) {
    commonService.createItem(req, res, next, Object)
  },

  async update(req, res, next) {
    commonService.updateItem(req, res, next, Object)
  },

  async delete(req, res, next) {
    commonService.deleteItem(req, res, next, Object)
  },

  async changeDeletionMark(req, res, next) {
    commonService.changeItemDeletionMark(req, res, next, Object)
  },
}
