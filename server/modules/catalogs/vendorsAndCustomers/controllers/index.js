const Object = require('../models/index')
const commonService = require('@services/commonService')

module.exports = {
  async findAll(req, res, next) {
    commonService.findAllItems(req, res, next, Object)
  },

  async findById(req, res, next) {
    commonService.findItem(req, res, next, Object)
  },

  async create(req, res, next) {
    commonService.createItem(req, res, next, Object)
  },

  async update(req, res, next) {
    commonService.updateItem(req, res, next, Object)
  },

  async changeDeletionMark(req, res, next) {
    commonService.changeItemDeletionMark(req, res, next, Object)
  },

  async delete(req, res, next) {
    commonService.deleteItem(req, res, next, Object)
  },
}
