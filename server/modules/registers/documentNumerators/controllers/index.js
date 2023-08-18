const catalogService = require('@services/catalogsService')
const httpStatus = require('http-status-codes')
const logger = require('@logging/logger')
const itemModel = require('../models')
const uuidlib = require('uuid')

module.exports = {
  async getAllItems(req, res, next) {
    let response
    try {
      response = await catalogService.findAllItems(itemModel)
      return res.status(response.httpStatus).send(response)
    } catch (err) {
      logger.error('Error in getAllItems Controller', { meta: err })
      return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ httpStatus: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: err })
    }
  },

  async getItemDetails(req, res, next) {
    let response
    try {
      response = await catalogService.findItemById(itemModel, req.params.id)
      return res.status(response.httpStatus).send(response)
    } catch (err) {
      logger.error('Error in getItemDetails Controller', { meta: err })
      return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ httpStatus: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: err })
    }
  },

  async createItem(req, res, next) {
    let response
    try {
      response = await catalogService.createItem(itemModel, req.body)
      return res.status(response.httpStatus).send(response)
    } catch (err) {
      logger.error('Error in createItem Controller', { meta: err })
      return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ httpStatus: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: err })
    }
  },

  async updateItem(req, res, next) {
    let response
    try {
      response = await catalogService.updateItem(itemModel, req.params.id, req.body)
      return res.status(response.httpStatus).send(response)
    } catch (err) {
      logger.error('Error in updateItem Controller', { meta: err })
      return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ httpStatus: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: err })
    }
  },

  async deleteItem(req, res, next) {
    let response
    try {
      response = await catalogService.deleteItem(itemModel, req.params.id)
      return res.status(response.httpStatus).send(response)
    } catch (err) {
      logger.error('Error in deleteItem Controller', { meta: err })
      return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ httpStatus: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: err })
    }
  },

  async getNextDocumentNumber() {
    let response
    const currentYearNumber = Number(new Date().getFullYear())
    response = await catalogService.findAllItems(itemModel, { yearNumber: currentYearNumber })
    if (response.httpStatus === 200) {
      if (response.responseData.length > 0) {
        const lastNumber = Number(response.responseData[0].dataValues.lastNumber)

        const updateNumberResponse = await catalogService.updateItem(itemModel, response.responseData[0].dataValues.id, {
          lastNumber: lastNumber + 1,
        })
        if (updateNumberResponse.httpStatus === 200) {
          return {
            yearNumber: currentYearNumber,
            number: lastNumber + 1,
          }
        } else
          return {
            yearNumber: currentYearNumber,
            number: 0,
          }
      } else {
        return {
          yearNumber: currentYearNumber,
          number: 1,
        }
      }
    } else {
      return {
        yearNumber: currentYearNumber,
        number: 0,
      }
    }
  },
}
