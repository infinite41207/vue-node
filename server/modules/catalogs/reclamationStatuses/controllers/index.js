const catalogService = require('@services/catalogsService')
const httpStatus = require('http-status-codes')
const logger = require('@logging/logger')
const itemModel = require('../models')
const statusGroupsModel = require('@catalogs/reclamationStatusGroups/models')
const roleGroupsController = require('@catalogs/roleGroups/controllers')
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

  async getAllItems(req, res, next) {
    let response
    let queryFilter = {}
    if (req.user.useCustomerAccess === true) {
      queryFilter = {
        userAccess: true,
      }
    }

    try {
      const includeArray = [
        {
          model: statusGroupsModel,
          as: 'statusgroup',
          attributes: ['id', 'description'],
        },
      ]
      response = await catalogService.findAllItems(itemModel, queryFilter, includeArray)
      return res.status(response.httpStatus).send(response)
    } catch (err) {
      logger.error('Error in getAllItems Controller', { meta: err })
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ httpStatus: httpStatus.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: err })
    }
  },

  async getItemDetails(req, res, next) {
    const include = [
      {
        model: statusGroupsModel,
        as: 'statusgroup',
        attributes: ['id', 'description'],
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
