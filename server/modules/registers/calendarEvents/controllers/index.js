const catalogService = require('@services/catalogsService')
const httpStatus = require('http-status-codes')
const logger = require('@logging/logger')
const itemModel = require('../models/index')
const { Op, literal } = require('sequelize')
const moment = require('moment')

module.exports = {
  async createItem(req, res, next) {
    const event = {
      ...req.body,
      ownerId: req.user.id,
    }
    let response
    try {
      response = await catalogService.createItemReturn(itemModel, event, { include: ['calendar'] })
      response.responseData = await itemModel.findByPk(response.responseData.id, { include: ['calendar', 'owner'] })
      return res.status(response.httpStatus).send(response)
    } catch (err) {
      logger.error('Error in createItem Controller', { meta: err })
      return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ httpStatus: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: err })
    }
  },

  async getAllItems(req, res, next) {
    let filterParams = {
      '$calendar.active$': true,
      [Op.or]: [
        { ownerId: req.user.id },
        { attendees: { [Op.contains]: [req.user.id] } },
        { '$calendar.ownerId$': req.user.id },
        {
          '$calendar.attendees$': {
            [Op.contains]: literal(`ARRAY['${req.user.id}']::uuid[]`),
          },
        },
        { '$calendar.type$': 'common' },
      ],
    }
    let filter = JSON.parse(req.query?.filter || '{}')

    if (filter.parentType) {
      filterParams.parentType = filter.parentType
    }
    if (filter.parentId) {
      filterParams.parentId = filter.parentId
    }
    if (filter.searchStr) {
      let search = `%${filter.searchStr}%`
      filterParams[Op.or] = [{ title: { [Op.like]: search } }, { notes: { [Op.like]: search } }]
    }
    if(filter.date) {
      const dateFrom = moment(filter.date).startOf('day').toISOString()
      const dateTo = moment(filter.date).endOf('day').toISOString()

      filterParams.createdAt = { [Op.between]: [dateFrom, dateTo] }
    }
    let response
    const pagination = JSON.parse(req.query.pagination || '{}')
    response = await catalogService.findAllItems(itemModel, filterParams, ['calendar', 'owner'], [], pagination)

    return res.status(response.httpStatus).send(response)
  },

  async updateItem(req, res, next) {
    let response
    try {
      response = await catalogService.updateItem(itemModel, req.body.id, req.body)
      response.responseData = await itemModel.findByPk(response.responseData.id, { include: ['calendar', 'owner'] })
      return res.status(response.httpStatus).send(response)
    } catch (err) {
      logger.error('Error in updateItem Controller', { meta: err })
      return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ httpStatus: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: err })
    }
  },

  async deleteItem(req, res, next) {
    let response
    try {
      response = await catalogService.deleteItem(itemModel, req.body.id)
      return res.status(response.httpStatus).send(response)
    } catch (err) {
      logger.error('Error in deleteItem Controller', { meta: err })
      return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ httpStatus: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: err })
    }
  },
}
