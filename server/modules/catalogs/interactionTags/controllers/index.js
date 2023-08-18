const catalogService = require('@services/catalogsService')
const httpStatus = require('http-status-codes')
const logger = require('@logging/logger')
const ItemModel = require('../models')
const uuidlib = require('uuid')

module.exports = {
  async create(req, res, next) {
    let response
    try {
      response = await catalogService.createItem(ItemModel, req.body)
      return res.status(response.httpStatus).send(response)
    } catch (err) {
      logger.error('Error in createItem Controller', { meta: err })
      return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ httpStatus: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: err })
    }
  },

  async getAll(req, res, next) {
    let queryFilter = {}

    try {
      const includeArray = []
      const order = ['name']
      response = await catalogService.findAllItems(ItemModel, queryFilter, includeArray, order)
      return res.status(response.httpStatus).send(response.responseData)
    } catch (err) {
      logger.error('Error in getAllItems Controller', { meta: err })
      return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ httpStatus: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: err })
    }
  },

  async getDetails(req, res, next) {
    let response
    try {
      response = await catalogService.findItemById(ItemModel, req.params.id)
      return res.status(response.httpStatus).send(response)
    } catch (err) {
      logger.error('Error in getItemDetails Controller', { meta: err })
      return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ httpStatus: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: err })
    }
  },

  async update(req, res, next) {
    let response
    try {
      response = await catalogService.updateItem(ItemModel, req.body.id, req.body)
      return res.status(response.httpStatus).send(response)
    } catch (err) {
      logger.error('Error in updateItem Controller', { meta: err })
      return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ httpStatus: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: err })
    }
  },

  async delete(req, res, next) {
    let response
    try {
      response = await catalogService.deleteItem(ItemModel, req.params.id)
      return res.status(response.httpStatus).send(response)
    } catch (err) {
      logger.error('Error in deleteItem Controller', { meta: err })
      return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ httpStatus: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: err })
    }
  },
}
