const uuidlib = require('uuid')
const httpStatus = require('http-status-codes')
const logger = require('@logging/logger')
const seederService = require('@services/seederService')
const { Op } = require('sequelize')
const moment = require('moment')
const objectVersioning = require('@services/objectVersionsService.js')

module.exports = {
  async findAllItems(req, res, next, object, params = {}) {
    const pagination = JSON.parse(req.query.pagination || '{}')
    const sort = JSON.parse(req.query.sort || '{}')
    let filter = JSON.parse(req.query.filter || '{}')
    const attributes = JSON.parse(req.query.attributes || '{}')

    if (params.filter) {
      filter = Object.assign(filter, params.filter)
    }

    if (filter.searchStr) {
      const searchFields = []

      for (const field in object.rawAttributes) {
        if (object.rawAttributes[field]._fullSearch) {
          searchFields.push(field)
        }
      }

      if (searchFields.length > 0) {
        if (searchFields.length > 1) {
          filter[Op.or] = []

          for (let searchField of searchFields) {
            filter[Op.or].push({ [searchField]: { [Op.iLike]: `%${filter.searchStr}%` } })
          }
        } else {
          filter[searchFields[0]] = {
            [Op.iLike]: `%${filter.searchStr}%`,
          }
        }
      }

      delete filter.searchStr
    }

    if (filter.period) {
      const dateFrom = filter.period[0]
      const dateTo = moment(filter.period[1]).endOf('day').toISOString()

      filter.date = { [Op.between]: [dateFrom, dateTo] }
      delete filter.period
    }

    const order = []
    if (sort?.sortBy) {
      let sortItem = sort.sortBy.split('.')
      if (sort.sortDesc === true) {
        sortItem.push('DESC')
      }
      order.push(sortItem)
    }

    // base sorting
    order.push('createdAt')

    const lang = req.query.lang
    const needTranslate = lang && lang !== 'pl'

    let include = this.prepareIncludes(object, params)

    try {
      let items

      if (pagination.page) {
        let limit = pagination.limit
        let offset = 0 + (pagination.page - 1) * limit

        items = await object.findAndCountAll({
          where: filter,
          offset,
          limit,
          attributes,
          order,
          include,
        })
      } else {
        items = await object.findAll({
          where: filter,
          attributes,
          order,
          include,
        })
      }

      if (items) {
        items = JSON.stringify(items)
        items = JSON.parse(items)

        if (needTranslate) {
          // TO DO
        }

        res.status(200).send(items)
      } else {
        logger.error(`Error in ${object.options.name.plural} findAll controller`, { meta: 'Items not find' })
        res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Items not find' })
      }
    } catch (error) {
      logger.error(`Error in ${object.options.name.plural} findAll controller`, { meta: error })
      res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ message: error })
    }
  },

  async findItem(req, res, next, object, params = {}) {
    const objId = req.params.id

    if (!objId || typeof objId !== 'string' || objId.length !== 36) {
      logger.error(`Error in ${object.options.name.plural} create controller`, { meta: 'Object id is not correct!' })
      res.status(httpStatus.StatusCodes.BAD_REQUEST).send({ message: 'Object id is not correct!' })
      return
    }

    params.objectDetails = true

    let include = this.prepareIncludes(object, params)

    await object
      .findByPk(objId, { include })
      .then((object) => {
        if (object) {
          res.status(httpStatus.StatusCodes.OK).send(object)
        } else {
          logger.error(`Error in ${object.options.name.plural} findByPk controller`, { meta: `${object.options.name.plural} not found` })
          res.status(httpStatus.StatusCodes.NOT_FOUND).send({ message: `${object.options.name.plural} not found` })
        }
      })
      .catch((error) => {
        logger.error(`Error in ${object.options.name.plural} findByPk controller`, { meta: error })
        res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ message: error })
      })
  },

  async createItem(req, res, next, object, params = {}) {
    const objectData = { ...req.body }

    if (!objectData.id) {
      objectData.id = uuidlib.v4()
    }

    if (objectData.presentation) {
      delete objectData.presentation
    }

    const include = []

    if (object.associations) {
      for (const as in object.associations) {
        if (object.associations[as].isMultiAssociation) {
          if (objectData.hasOwnProperty(as)) {
            let model = object.associations[as].target
            include.push({ model, as })
          }
        }
      }
    }

    await object
      .create(objectData, { include })
      .then((newItem) => {
        if (newItem) {
          res.status(httpStatus.StatusCodes.OK).send(newItem)

          if (params.initDataFile) {
            seederService.updateInitialData(object, params.initDataFile)
          }

          objectVersioning.onChangeHandler(object, newItem.id, 'create', req.user?.id)
        } else {
          logger.error(`Error in ${object.options.name.plural} create controller`, { meta: error })
          res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ message: `${object.options.name.plural} is not created` })
        }
      })
      .catch((error) => {
        logger.error(`Error in ${object.options.name.plural} create controller`, { meta: error })
        res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ message: `${object.options.name.plural} is not created` })
      })
  },

  async updateItem(req, res, next, object, params = {}) {
    const objId = req.params.id

    if (!objId || typeof objId !== 'string' || objId.length !== 36) {
      logger.error(`Error in ${object.options.name.plural} create controller`, { meta: 'Object id is not correct!' })
      res.status(httpStatus.StatusCodes.BAD_REQUEST).send({ message: 'Object id is not correct!' })
      return
    }

    const objectData = { ...req.body }
    delete objectData.presentation

    const include = []
    if (object.associations) {
      for (const as in object.associations) {
        if (object.associations[as].isMultiAssociation) {
          if (objectData.hasOwnProperty(as)) {
            let model = object.associations[as].target
            include.push({ model, as })
          }
        }
      }
    }

    const existItem = await object.findByPk(objId, { include })

    if (existItem) {
      if (objectData.updatedAt) {
        const updatedAt = new Date(objectData.updatedAt)

        if (existItem.updatedAt > updatedAt) {
          logger.error(`Error in ${object.options.name.plural} update controller`, { meta: 'The data version is less than the existing one in the database' })
          res.status(httpStatus.StatusCodes.BAD_REQUEST).send({ message: 'The data version is less than the existing one in the database' })
          return
        }
      } else {
        logger.error(`Error in ${object.options.name.plural} update controller`, { meta: 'The data version not defined' })
        res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'The data version not defined' })
      }

      try {
        const result = await object.sequelize.transaction(async (t) => {
          const updatedItem = await existItem.update(objectData, { transaction: t })

          if (include.length > 0) {
            for (const incTable of include) {
              await incTable.model.destroy({ where: { parentId: existItem.id } }, { transaction: t })

              await incTable.model.bulkCreate(
                objectData[incTable.as].map((el) => ({
                  ...el,
                  parentId: existItem.id,
                })),
                { transaction: t }
              )
            }
          }

          return updatedItem
        })

        if (result) {
          res.status(httpStatus.StatusCodes.OK).send(result)

          if (params.initDataFile) {
            seederService.updateInitialData(object, params.initDataFile)
          }

          objectVersioning.onChangeHandler(object, objId, 'update', req.user?.id)
        }
      } catch (error) {
        logger.error(`Error in ${object.options.name.plural} update controller`, { meta: error })
        res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ message: error })
      }
    } else {
      logger.error(`Error in ${object.options.name.plural} update controller`, { meta: `${object.options.name.plural} not found` })
      res.status(httpStatus.StatusCodes.NOT_FOUND).send({ message: `${object.options.name.plural} not found` })
    }
  },

  async deleteItem(req, res, next, object, params = {}) {
    const objId = req.params.id

    if (!objId || typeof objId !== 'string' || objId.length !== 36) {
      logger.error(`Error in ${object.options.name.plural} create controller`, { meta: 'Object id is not correct!' })
      res.status(httpStatus.StatusCodes.BAD_REQUEST).send({ message: 'Object id is not correct!' })
      return
    }

    const existItem = await object.findByPk(objId)

    if (existItem) {
      const include = []

      if (object.associations) {
        for (const as in object.associations) {
          if (object.associations[as].isMultiAssociation) {
            if (objectData.hasOwnProperty(as)) {
              let model = object.associations[as].target
              include.push({ model, as })
            }
          }
        }
      }

      await existItem
        .destroy({ where: { id: objId }, include })
        .then(() => {
          if (params.initDataFile) {
            seederService.updateInitialData(object, params.initDataFile)
          }

          res.status(httpStatus.StatusCodes.OK).send({ message: 'OK' })
        })
        .catch((error) => {
          logger.error(`Error in ${object.options.name.plural} delete controller`, { meta: error })
          res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ message: error })
        })
    } else {
      logger.error(`Error in ${object.options.name.plural} delete controller`, { meta: `${object.options.name.plural} not found` })
      res.status(httpStatus.StatusCodes.NOT_FOUND).send({ message: `${object.options.name.plural} not found` })
    }
  },

  async changeItemDeletionMark(req, res, next, object, params = {}) {
    const objId = req.body.id

    if (!objId || typeof objId !== 'string' || objId.length !== 36) {
      logger.error(`Error in ${object.options.name.plural} changeDeletionMark controller`, { meta: 'Object id is not correct!' })
      res.status(httpStatus.StatusCodes.BAD_REQUEST).send({ message: 'Object id is not correct!' })
      return
    }

    const existItem = await object.findByPk(objId)

    if (existItem) {
      const objectData = {
        markedToDelete: !existItem.markedToDelete,
      }

      await existItem
        .update(objectData)
        .then((updatedItem) => {
          res.status(httpStatus.StatusCodes.OK).send(updatedItem)

          if (params.initDataFile) {
            seederService.updateInitialData(object, params.initDataFile)
          }

          objectVersioning.onChangeHandler(object, objId, 'update', req.user?.id)
        })
        .catch((error) => {
          logger.error(`Error in ${object.options.name.plural} changeDeletionMark controller`, { meta: error })
          res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ message: error })
        })
    } else {
      logger.error(`Error in ${object.options.name.plural} changeDeletionMark controller`, { meta: error })
      res.status(httpStatus.StatusCodes.NOT_FOUND).send({ message: `${object.options.name.plural} not found` })
    }
  },

  prepareIncludes(object, params) {
    let include = []
    let compactInclude = true // default mode

    if (params.hasOwnProperty('compactInclude')) {
      compactInclude = params.compactInclude
    }

    if (params.include) {
      include = params.include
    } else if (object.associations) {
      if (compactInclude === true) {
        for (let as in object.associations) {
          let model = object.associations[as].target

          if (object.associations[as].isSingleAssociation) {
            let attributes = ['id', 'presentation']

            if (object.associations[as].target.rawAttributes.name) {
              attributes.push('name')
            }

            include.push({ model, as, attributes }) // include field ref data
          } else if (params.objectDetails) {
            const count = include.push({ model, as }) // include tables

            if (model.associations) {
              include[count - 1].include = []

              for (let tFieldAs in model.associations) {
                let tFieldModel = model.associations[tFieldAs].target

                if (model.associations[tFieldAs].isSingleAssociation) {
                  let tFieldAttributes = ['id', 'presentation']

                  if (model.associations[tFieldAs].target.rawAttributes.name) {
                    tFieldAttributes.push('name')
                  }

                  include[count - 1].include.push({ model: tFieldModel, as: tFieldAs, attributes: tFieldAttributes }) // include table field ref data
                }
              }
            }
          }
        }
      } else {
        include = { all: true }
      }
    }

    return include
  },

  async setAuthor(objectData, req) {
    if (req.user) {
      objectData.authorId = req.user.id
      objectData.authorName = req.user.name
    } else {
      console.error('Not found user on request!')
    }
  },

  executeConditionCode(str, args) {
    const conditionFunction = new Function('args', str)
    const conditionRes = conditionFunction(args)
    return conditionRes
  },
}
