const ReportVariant = require('../models')
const { Op } = require('sequelize')

const objectDescription = 'Report variant'

module.exports = {
  async findAll(req, res, next) {
    const query = { ...req.query }

    let filter = {
      reportName: query.reportType,
      userId: { [Op.or]: [null, query.currentUserId] },
    }

    await ReportVariant.findAll({
      where: filter,
      attributes: ['id', 'variantName', 'userId'],
      order: ['id'],
    })
      .then((reportVariants) => {
        res.status(200).send(reportVariants)
      })
      .catch((error) => {
        console.error(error)
        res.status(400).send({
          message: 'Bad request',
        })
      })
  },

  async findById(req, res, next) {
    let reportVariant = await ReportVariant.findByPk(req.params.id)

    if (reportVariant) {
      reportVariant.settings = JSON.parse(reportVariant.settings)

      res.status(200).send(reportVariant)
    } else {
      res.status(400).send({ message: 'Report variant not find' })
    }
  },

  async create(req, res, next) {
    await ReportVariant.create(req.body)
      .then(async (newItem) => {
        if (newItem) {
          res.status(200).send({ message: 'OK' })
        } else {
          res.status(400).send({ message: 'Report variant nie stworzony' })
        }
      })
      .catch((error) => {
        console.error(error)
        res.status(400).send({ message: 'Report variant is not created' })
      })
  },

  async update(req, res, next) {
    const existItem = await ReportVariant.findByPk(req.params.id)

    if (existItem) {
      await existItem
        .update(req.body)
        .then((updatedItem) => {
          res.status(200).send(updatedItem)
        })
        .catch((error) => {
          logger.error('Error in deleteItem Controller', { meta: error })
          res.status(400).send({ message: 'błąd wewnętrzny' })
        })
    } else {
      logger.error('Report variant not find')
      res.status(400).send({ message: 'Report variant not find' })
    }
  },

  async delete(req, res, next) {
    console.log('par', req.params)
    const existItem = await ReportVariant.findByPk(req.params.id)

    if (existItem) {
      await existItem
        .destroy(req.params.id)
        .then(() => {
          res.status(200).send({ message: 'OK' })
        })
        .catch((err) => {
          res.status(400).send({ message: 'Błąd wewnętrzny' })
        })
    } else {
      res.status(400).send({ message: `${objectDescription} not found` })
    }
  },
}
