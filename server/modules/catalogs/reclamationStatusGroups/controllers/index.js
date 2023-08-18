const catalogService = require('@services/catalogsService')
const httpStatus = require('http-status-codes')
const logger = require('@logging/logger')
const itemModel = require('../models')
const reclModel = require('@documents/reclamations/models/reclamation')
const statusModel = require('@catalogs/reclamationStatuses/models')
const uuidlib = require('uuid')
const { Op } = require('sequelize')

module.exports = {
  async createItem(req, res, next) {
    let response
    try {
      response = await catalogService.createItem(itemModel, req.body)
      if (res) {
        return res.status(response.httpStatus).send(response)
      }
    } catch (err) {
      logger.error('Error in createItem Controller', { meta: err })
      return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ httpStatus: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: err })
    }
  },

  async getAllItems(req, res, next) {
    let response
    try {
      response = await catalogService.findAllItems(itemModel, [], [], [['sortId', 'ASC']])
      return res.status(response.httpStatus).send(response)
    } catch (err) {
      logger.error('Error in getAllItems Controller', { meta: err })
      return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ httpStatus: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: err })
    }
  },

  async countAll(req, res, next) {
    const statuses = await statusModel.findAll();
    const groups = await itemModel.findAll();

    const searchIds = []

    for(let i = 0; i < groups.length; i++) {
      const insertObject = []

      for(let j = 0; j < statuses.length; j++) {
        if(statuses[j].statusgroupid === groups[i].id) {
          insertObject.push({ statusId: statuses[j].id })
        }
      }

      if(groups[i].description !== 'Wszystkie') {
        searchIds.push({ id: groups[i].id, statuses: insertObject })
      }
    }

    let response
    try {
      const finalItem = []

      let sum = 0;
      for(let j = 0; j < searchIds.length; j++) {
        response = await reclModel.count({
          where: {
            [Op.or]: searchIds[j].statuses
          }
        })

        finalItem.push({ id: searchIds[j].id, count: response })
        sum += response
      }

      finalItem.push({ id: '0', count: sum })

      res.status(200).send(finalItem)
    } catch(err) {
      res.status(400).send({ message: 'Błąd wewnętrzny' })
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

  async updateItem(req, res, next) {
    let response
    try {
      response = await catalogService.updateItem(itemModel, req.body.id, req.body)
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
