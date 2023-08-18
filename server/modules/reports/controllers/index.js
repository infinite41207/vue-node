const Report = require('../models/index')
const ReportField = require('../models/fields')
const ReportGroup = require('../models/groups')
const ReportFunc = require('../models/funcs')
const ReportSort = require('../models/sort')

const { Op } = require('sequelize')
const seederService = require('@services/seederService')
const ReportFilter = require('../models/filters')
const objectDescription = 'Reports'

module.exports = {
  async findAll(req, res, next) {
    let filter = JSON.parse(req.query.filter || '{}')
    const pagination = JSON.parse(req.query.pagination || '{}')
    const sort = JSON.parse(req.query.sort || '{}')
    const lang = req.query.lang

    const needTranslate = lang && lang !== 'pl'

    if (filter.searchStr) {
      filter[Op.or] = [{ name: { [Op.iLike]: `%${filter.searchStr}%` } }, { key: { [Op.iLike]: `%${filter.searchStr}%` } }]
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

    let items = null

    if (pagination.page) {
      let limit = pagination.limit
      let offset = 0 + (pagination.page - 1) * limit
      items = await Report.findAndCountAll({
        where: filter,
        offset,
        limit,
        order,
      })
    } else {
      items = await Report.findAll({
        where: filter,
        order,
      })
    }

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

  async findById(req, res, next) {
    let item = await Report.findByPk(req.params.id, {
      include: [
        {
          model: ReportField,
          as: 'fields',
        },
        {
          model: ReportFilter,
          as: 'fielters',
          include: [
            {
              model: ReportField,
              as: 'field',
              attributes: ['name'],
            },
          ],
        },
        {
          model: ReportGroup,
          as: 'groups',
          include: [
            {
              model: ReportField,
              as: 'field',
              attributes: ['name'],
            },
          ],
        },
        {
          model: ReportFunc,
          as: 'funcs',
          include: [
            {
              model: ReportField,
              as: 'field',
              attributes: ['name'],
            },
          ],
        },
        {
          model: ReportSort,
          as: 'sorts',
          include: [
            {
              model: ReportField,
              as: 'field',
              attributes: ['name'],
            },
          ],
        },
      ],
    })

    if (item) {
      res.status(200).send(item)
    } else {
      res.status(400).send({ message: `${objectDescription} not found` })
    }
  },

  async create(req, res) {
    const objectData = { ...req.body }

    await Report.create(objectData)
      .then(async (newItem) => {
        if (newItem) {
          res.status(200).send(newItem)
          updateInitialData()
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
    const existItem = await Report.findByPk(req.params.id)

    if (existItem) {
      const objectData = { ...req.body }

      delete objectData.presentation

      await existItem
        .update(objectData)
        .then((updatedItem) => {
          updateInitialData()
          res.status(200).send({ message: 'ok' })
        })
        .catch((err) => {
          console.error(err)
          res.status(400).send({ message: 'Błąd wewnętrzny' })
        })
    } else {
      res.status(400).send({ message: `${objectDescription} not found` })
    }
  },

  async delete(req, res, next) {
    const existItem = await Report.findByPk(req.params.id)

    if (existItem) {
      await existItem
        .destroy(req.params.id)
        .then(() => {
          updateInitialData()
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

async function updateInitialData() {
  seederService.updateInitialData(Report, 'reports')
  seederService.updateInitialData(ReportField, 'report_fields')
  seederService.updateInitialData(ReportGroup, 'report_groups')
  seederService.updateInitialData(ReportFunc, 'report_funcs')
  seederService.updateInitialData(ReportSort, 'report_sorts')
}
