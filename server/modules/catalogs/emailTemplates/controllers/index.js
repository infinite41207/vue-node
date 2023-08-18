const catalogService = require('@services/catalogsService')
const httpStatus = require('http-status-codes')
const logger = require('@logging/logger')
const itemModel = require('../models')
const uuidlib = require('uuid')
const { Op } = require('sequelize')
const commonService = require('@services/commonService')

module.exports = {
  async findAll(req, res, next) {
    const filter = JSON.parse(req.query.filter || '{}')
    const pagination = JSON.parse(req.query.pagination || '{}')
    const sort = JSON.parse(req.query.sort || '{}')

    if (filter.searchStr) {
      filter[Op.or] = [{ name: { [Op.iLike]: `%${filter.searchStr}%` } }]
      delete filter.searchStr
    }

    let order = []
    if (sort.sortBy) {
      let sortItem = sort.sortBy.split('.')
      if (sort.sortDesc === true) {
        sortItem.push('DESC')
      }
      order.push(sortItem)
    }

    order.push(['id'])

    const include = []

    let items = null

    if (pagination.page) {
      let limit = pagination.limit
      let offset = 0 + (pagination.page - 1) * limit
      items = await itemModel.findAndCountAll({
        where: filter,
        offset,
        include,
        limit,
        order,
      })
    } else {
      items = await itemModel.findAll({
        where: filter,
        include,
        order,
      })
    }

    if (items) {
      items = JSON.stringify(items)
      items = JSON.parse(items)

      if (req.user) {
        if (req.user.fullRights === true) {
          res.status(200).send(items)
        } else {
          const resultEA = []
          if (pagination.page) {
            for (let item of items.rows) {
              if (item.isGeneral) {
                resultEA.push(item)
              } else {
                const eAUser = itemModel.users.find((el) => {
                  return el.userId === req.user.id
                })

                if (eAUser !== undefined) {
                  resultEA.push(item)
                }
              }
            }
          } else {
            for (let item of items) {
              if (item.isGeneral) {
                resultEA.push(item)
              } else {
                const eAUser = itemModel.users.find((el) => {
                  return el.userId === req.user.id
                })

                if (eAUser !== undefined) {
                  resultEA.push(item)
                }
              }
            }
          }

          res.status(200).send(resultEA)
        }
      } else {
        res.status(200).send([])
      }
    } else {
      console.error(err)
      res.status(400).send({
        message: 'Bad request',
      })
    }
  },

  async findById(req, res, next) {
    commonService.findItem(req, res, next, itemModel)
  },

  async create(req, res, next) {
    commonService.createItem(req, res, next, itemModel)
  },

  async update(req, res, next) {
    commonService.updateItem(req, res, next, itemModel)
  },

  async delete(req, res, next) {
    commonService.deleteItem(req, res, next, itemModel)
  },
}
