const User = require('../models')
const userService = require('@services/userService')
const httpStatus = require('http-status-codes')
const logger = require('@logging/logger')
const uuidlib = require('uuid')
const { Op, Sequelize } = require('sequelize')

module.exports = {
  async findAll(req, res, next) {

    const filter = JSON.parse(req.query.filter || '{}')

    if (filter.searchStr) {
      filter.name = { [Op.iLike]: `%${filter.searchStr}%` }
      delete filter.searchStr
    }

    let items = await User.findAll({
      where: filter,
      attributes: { exclude: ['password', 'emailConfirmationToken', 'passwordResetExpires', 'passwordResetToken', 'referralToken'] },
      order: ['name'],
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

  async getDetails(req, res, next) {
    let response
    try {
      response = await userService.getDetails(req.params.id)
      return res.status(response.httpStatus).send(response.result)
    } catch (error) {
      logger.error('Error in getUserDetails Controller', { meta: error })
      return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ message: error })
    }
  },

  async create(req, res, next) {
    const objectData = { ...req.body }

    if (!objectData.uuid) {
      objectData.uuid = uuidlib.v4()
    }

    if (objectData.presentation) {
      delete objectData.presentation
    }

    await User.create(objectData)
      .then(async (newItem) => {
        if (newItem) {
          res.status(200).send(newItem)
        } else {
          res.status(400).send({ message: `${objectDescription} is not created` })
        }
      })
      .catch((err) => {
        console.error(err)
        res.status(400).send({ message: `${objectDescription} is not created` })
      })
  },

  async update(req, res, next) {
    let response
    try {
      response = await userService.update(req.params.id, req.body)
      return res.status(response.httpStatus).send(response.result)
    } catch (error) {
      logger.error('Error in updateUser Controller', { meta: error })
      return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ message: error })
    }
  },

  async delete(req, res, next) {
    let response
    try {
      response = await userService.delete(req.params.id)
      return res.status(response.httpStatus).send(response.result)
    } catch (error) {
      logger.error('Error in delete user Controller', { meta: error })
      return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ message: error })
    }
  },
}
