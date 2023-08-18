const { Op } = require('sequelize')
const httpStatus = require('http-status-codes')

const catalogService = require('@services/catalogsService')
const itemModel = require('../models/index')

module.exports = {
  async getAllItems(req, res, next) {
    const filterParams = {
      active: true,
      [Op.or]: [{ ownerId: req.user.id }, { attendees: { [Op.contains]: [req.user.id] } }, { type: 'common' }],
    }

    const response = await catalogService.findAllItems(itemModel, filterParams)

    return res.status(response.httpStatus).send(response)
  },
  async createItem(req, res, next) {
    try {
      const calendar = {
        ...req.body,
        ownerId: req.user.id,
      }

      const response = await catalogService.createItemReturn(itemModel, calendar)
      return res.status(response.httpStatus).send(response)
    } catch (err) {
      logger.error('Error in createItem Controller', { meta: err })
      return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({
        httpStatus: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR,
        status: 'failed',
        errorDetails: err,
      })
    }
  },
  async updateItem(req, res, next) {
    try {
      const response = await catalogService.updateItem(itemModel, req.body.id, req.body)
      return res.status(response.httpStatus).send(response)
    } catch (err) {
      logger.error('Error in updateItem Controller', { meta: err })
      return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({
        httpStatus: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR,
        status: 'failed',
        errorDetails: err,
      })
    }
  },

  async deleteItem(req, res, next) {
    try {
      const response = await catalogService.updateItem(itemModel, req.body.id, { active: false })
      return res.status(response.httpStatus).send(response)
    } catch (err) {
      logger.error('Error in deleteItem Controller', { meta: err })
      return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({
        httpStatus: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR,
        status: 'failed',
        errorDetails: err,
      })
    }
  },
}
