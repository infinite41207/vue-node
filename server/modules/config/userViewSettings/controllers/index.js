const ObjectModel = require('../models')
const { Op } = require('sequelize')
const httpStatus = require('http-status-codes')

const objectDescription = 'View settings'

module.exports = {
  async findAll(req, res, next) {
    const filter = JSON.parse(req.query.filter || '{}')

    let list = await ObjectModel.findAll({
      where: filter,
      order: ['id'],
    }).catch((err) => {
      console.error(err)
      res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ message: err })
    })

    if (list) {
      list = JSON.stringify(list)
      list = JSON.parse(list)

      res.status(httpStatus.StatusCodes.OK).send(list)
    }
  },

  async findById(req, res, next) {
    let item = await ObjectModel.findByPk(req.params.id)

    if (item) {
      res.status(200).send(item)
    } else {
      res.status(400).send({ message: `${objectDescription} not found` })
    }
  },

  async create(req, res) {
    const objectData = { ...req.body }

    await ObjectModel.create(objectData)
      .then(async (newItem) => {
        if (newItem) {
          res.status(200).send(newItem)
        } else {
          console.error(`${objectDescription} is not created`)
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
