const catalogService = require('@services/catalogsService')
const httpStatus = require('http-status-codes')
const logger = require('@logging/logger')
const itemModel = require('../models')
const { getItemDetails } = require('../../../documents/reclamations/controllers/reclamationItem')
const uuidlib = require('uuid')

module.exports = {
  async createItem(req, res, next) {
    let response
    try {
      response = await catalogService.createItem(itemModel, req.body)
      return res.status(response.httpStatus).send(response)
    } catch (err) {
      logger.error('Error in createItem Controller', { meta: err })
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: err })
    }
  },

  async findAll(req, res, next) {
    const filter = JSON.parse(req.query.filter || '{}')

    let items = await itemModel.findAll({
      where: filter,
      order: ['id'],
    })

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

  async findByPk(req, res, next) {
    let item = await itemModel.findByPk(req.params.id)

    if (item) {
      res.status(200).send(item)
    } else {
      res.status(400).send({ message: `${objectDescription} not found` })
    }
  },

  async updateItem(req, res, next) {
    let response
    try {
      response = await catalogService.updateItem(itemModel, req.body.id, req.body)
      return res.status(response.httpStatus).send(response)
    } catch (err) {
      logger.error('Error in updateItem Controller', { meta: err })
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: err })
    }
  },

  async deleteItem(req, res, next) {
    let response
    try {
      response = await catalogService.deleteItem(itemModel, req.body.id)
      return res.status(response.httpStatus).send(response)
    } catch (err) {
      logger.error('Error in deleteItem Controller', { meta: err })
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: err })
    }
  },
}
