const ObjectModel = require('../models/index')
const uuidlib = require('uuid')
const objectDescription = 'Scale'
const { Op, Sequelize } = require('sequelize')
const ScaleProtocol = require('@catalogs/scaleProtocols/models')

module.exports = {
  async findAll(req, res, next) {
    const filter = JSON.parse(req.query.filter || '{}')
    const pagination = JSON.parse(req.query.pagination || '{}')
    const sort = JSON.parse(req.query.sort || '{}')

    if (filter.searchStr) {
      filter.name = {
        [Op.iLike]: `%${filter.searchStr}%`,
      }
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

    let items
    if (pagination.page) {
      let limit = pagination.limit
      let offset = 0 + (pagination.page - 1) * limit
      items = await ObjectModel.findAndCountAll({
        where: filter,
        offset: offset,
        limit: limit,
        order,
      })
    } else {
      items = await ObjectModel.findAll({
        where: filter,
        order,
      })
    }

    if (items) {
      items = JSON.stringify(items)
      items = JSON.parse(items)

      res.status(200).send(items)
    } else {
      console.error("can't find all scales: ", err)
      res.status(400).send({
        message: 'Bad request',
      })
    }
  },

  async findById(req, res, next) {
    let item = await ObjectModel.findByPk(req.params.id, {
      include: [
        {
          model: ScaleProtocol,
          //attributes: ["id", "name"],
          as: 'scaleProtocol',
        },
      ],
    })

    if (item) {
      res.status(200).send(item)
    } else {
      res.status(400).send({ message: `${objectDescription} not found` })
    }
  },

  async findByName(req, res, next) {
    const filter = { name: req.params.name }
    const item = await ObjectModel.findOne({ where: filter })
    if (item) {
      return res.status(200).send(item)
    } else {
      return res.status(400).send({ message: `${objectDescription} not found` })
    }
  },

  async create(req, res) {
    const objectData = { ...req.body }

    if (!objectData.uuid) {
      objectData.uuid = uuidlib.v4()
    }

    if (objectData.presentation) {
      delete objectData.presentation
    }

    await ObjectModel.create(objectData)
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
    const existItem = await ObjectModel.findByPk(req.params.id)

    if (existItem) {
      const objectData = { ...req.body }

      delete objectData.presentation
      await existItem
        .update(objectData)
        .then((updatedItem) => {
          res.status(200).send(updatedItem)
        })
        .catch((err) => {
          res.status(400).send({ message: 'Błąd wewnętrzny' })
        })
    } else {
      res.status(400).send({ message: `${objectDescription} not found` })
    }
  },

  async delete(req, res, next) {
    const existItem = await ObjectModel.findByPk(req.params.id)

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
