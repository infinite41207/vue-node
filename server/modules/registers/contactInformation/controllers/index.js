const Object = require('../models/index')
const commonService = require('@services/commonService')
const _ = require('lodash')

module.exports = {

  async findAll(req, res, next) {
    commonService.findAllItems(req, res, next, Object)
  },

  async findById(req, res, next) {
    commonService.findItem(req, res, next, Object)
  },

  async create(req, res, next) {  
    commonService.createItem(/*createParams*/req, res, next, Object)
  },

  async update(req, res, next) {
    commonService.updateItem(req, res, next, Object)
  },

  async delete(req, res, next) {
    commonService.deleteItem(req, res, next, Object)
  },

  async changeDeletionMark(req, res, next) {
    commonService.changeItemDelMark(req, res, next, Object)
  },
}
