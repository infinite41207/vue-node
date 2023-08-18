const catalogService = require('@services/catalogsService')
const httpStatus = require('http-status-codes')
const logger = require('@logging/logger')
const DocumentPrefix = require('../models')
const DocumentType = require('../models/documentType')
const uuidlib = require('uuid')

const objectDescription = 'Document Prefix'

module.exports = {
  async getAll(req, res, next) {
    const filter = JSON.parse(req.query.filter || '{}')
    let items = await DocumentPrefix.findAll({
      where: filter,
      order: ['id'],
      include: [{ model: DocumentType, as: 'documentTypes' }],
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

  async findById(req, res, next) {
    let item = await DocumentPrefix.findByPk(req.params.id, { include: [{ model: DocumentType, as: 'documentTypes' }] })

    if (item) {
      res.status(200).send(item)
    } else {
      res.status(400).send({ message: `${objectDescription} not found` })
    }
  },

  async create(req, res, next) {
    const { documentTypes, ...objectData } = req.body

    if (!objectData.uuid) {
      objectData.uuid = uuidlib.v4()
    }

    if (objectData.presentation) {
      delete objectData.presentation
    }

    await DocumentPrefix.create(objectData)
      .then(async (newItem) => {
        if (newItem) {
          for (let documentType of documentTypes) {
            await DocumentType.create({ ...documentType, documentPrefixId: newItem.id }).catch((error) => {
              console.error(error)
              res.status(400).send({ message: `${objectDescription} is not created` })
            })
          }

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
    const existItem = await DocumentPrefix.findByPk(req.params.id)

    if (existItem) {
      const { documentTypes, ...objectData } = req.body

      if (objectData.presentation) {
        delete objectData.presentation
      }

      await existItem
        .update(objectData)
        .then(async (updatedItem) => {
          await DocumentType.destroy({ where: { documentPrefixId: req.params.id } }).catch((err) => {
            res.status(400).send({ message: 'błąd wewnętrzny' })
          })

          for (let documentType of documentTypes) {
            await DocumentType.create({ ...documentType, documentPrefixId: req.params.id }).catch((error) => {
              console.error(error)
              res.status(400).send({ message: `${objectDescription} is not created` })
            })
          }

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
    const existItem = await DocumentType.findByPk(req.params.id)

    if (existItem) {
      await existItem
        .destroy({
          where: {
            id: req.params.id,
          },
          include: [{ model: DocumentType, as: 'documentTypes' }],
        })
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
