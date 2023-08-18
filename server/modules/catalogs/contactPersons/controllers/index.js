const Object = require('../models')
const commonService = require('@services/commonService')

const StandingModel = require('@catalogs/standings/models')
const Counterparty = require('@catalogs/counterparties/models')
const Employee = require('@catalogs/employees/models')

function getInclude() {
  const include = [
    {
      model: StandingModel,
      as: 'standing',
      attributes: ['id', 'description'],
    },
    {
      model: Counterparty,
      as: 'counterparty',
      attributes: ['id', 'name'],
    },
    {
      model: Employee,
      as: 'employee',
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
