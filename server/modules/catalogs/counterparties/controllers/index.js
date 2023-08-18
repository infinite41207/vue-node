const httpStatus = require('http-status-codes')
const { Op } = require('sequelize')
const moment = require('moment')
const Object = require('../models')
const commonService = require('@services/commonService')
const userRightsService = require('@services/userRightsService')

module.exports = {
  async findAll(req, res, next) {
    let filter = {}
    const customerRigth = await userRightsService.getCustomerFilter(req)

    if (customerRigth.fullAccess === false) {
      filter = { id: customerRigth.counterparties }
    }

    commonService.findAllItems(req, res, next, Object, { filter })
  },

  async getCount(req, res, next) {
    let filter = JSON.parse(req.query.filter || '{}')

    if (filter.period) {
      const dateFrom = filter.period[0]
      const dateTo = moment(filter.period[1]).endOf('day').toISOString()

      filter.createdAt = { [Op.between]: [dateFrom, dateTo] }
      delete filter.period
    }

    const count = await Object.count({ where: filter })
    return res.status(200).send({ count })
  },

  async findById(req, res, next) {
    commonService.findItem(req, res, next, Object)
  },

  async create(req, res, next) {
    commonService.createItem(req, res, next, Object)
  },

  async update(req, res, next) {
    commonService.updateItem(req, res, next, Object)
  },

  async changeDeletionMark(req, res, next) {
    commonService.changeItemDeletionMark(req, res, next, Object)
  },

  async customerEmails(req, res, next) {
    await Object.findAll({
      where: { email: { [Op.ne]: null } },
      attributes: ['email'],
      group: ['email'],
      order: ['email'],
    })
      .then((emails) => {
        let emailList = []
        for (let emailRow of emails) {
          const em = emailRow.email.split(';')

          for (let e of em) {
            emailList.push(e)
          }
        }

        res.status(200).send(emailList)
      })
      .catch((error) => {
        logger.error(`Error in ${Object.options.name.plural} customerEmails controller`, { meta: error })
        res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ message: error })
      })
  },
}
