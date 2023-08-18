const documentsService = require('@services/documentsService')
const httpStatus = require('http-status-codes')
const logger = require('@logging/logger')
const Interaction = require('../models')
const InteractionComment = require('../models/comment')
const InteractionStatus = require('@catalogs/interactionStatuses/models')
const EventTypes = require('@catalogs/eventTypes/models')
const EventStatuses = require('@catalogs/eventStatuses/models')
const InteractionFile = require('../models/file')
const InteractionCommentFile = require('../models/commentFile')
const Task = require('@documents/tasks/models/task')
const Events = require('@documents/events/models')
const TaskOrder = require('@documents/tasks/models/taskOrder')
const TaskFile = require('@documents/tasks/models/taskFile')
const Order = require('@documents/salesOrders/models/order')
const Customer = require('@catalogs/counterparties/models')
const User = require('@catalogs/users/models')
const Employee = require('@catalogs/employees/models')
const IncomingEmailLink = require('@documents/incomingEmails/models/incomingEmailLink')
const IncomingEmail = require('@documents/incomingEmails/models')
const OutgoingEmailLink = require('@documents/outgoingEmails/models/outgoingEmailLink')
const NotificationService = require('@services/notificationService')
const accessService = require('@services/userAccessService')

const TimeTrackingModel = require('@registers/objectsTimeTracking/models/index')
const _ = require('lodash')

const moment = require('moment')

const { Op } = require('sequelize')
const uuidlib = require('uuid')
const fileService = require('@services/fileService')
const objectVersionsService = require('@services/objectVersionsService')

const zeroPad = (num, places) => String(num).padStart(places, '0')

module.exports = {
  async create(req, res, next) {
    let response

    let { object, byEmail, emailData, newVersion } = req.body

    object.uuid = uuidlib.v4()

    if (req.user) {
      object.authorId = req.user.id
    }

    let deactivateOtherWersions = false

    if (object.versionUuid === '') {
      object.version = 1
      object.versionUuid = uuidlib.v4()

      if (object.customer) {
        if (object.customer) {
          object.customerId = object.customer.id
          delete object.customer
        }
        if (object.executor) { 
          object.executorId = object.executor.id
          delete object.executor
        }
        if (object.manager) {
          object.managerId = object.manager.id
          delete object.manager
        }
      }

      const newDocumentNumber = await getNextDocumentNumber(object)

      object.number = newDocumentNumber.number
      object.numberStr = `${object.prefix}/${zeroPad(newDocumentNumber.number, 5)}${newDocumentNumber.numberSufix}`
    } else {
      deactivateOtherWersions = true
    }

    object.tags = JSON.stringify(object.tags)

    response = await documentsService.createItem(Interaction, object)

    if (response.httpStatus === 200) {
      // add notifacation
      if (object.executorId && req.user.id !== object.executorId) {
        NotificationService.addChanges(
          {
            objectId: response.responseData.id,
            objectName: 'interaction',
            title: `Interakcja ${object.numberStr}`,
            description: 'Dodano nowy',
            read: false,
            type: 'INFO',
            userId: object.executorId,
          },
          req
        )
      }

      if (deactivateOtherWersions === true) {
        deactivateOtherVersions(response.responseData)
      }

      await objectVersionsService.addChanges(
        {
          objectId: response.responseData.id,
          objectType: 'interaction',
          description: 'Stworzono',
        },
        req
      )

      if (response.httpStatus === 200 && (byEmail === true || object.comment.length > 0)) {
        const responseComment = await documentsService.createItem(InteractionComment, {
          authorId: object.authorId,
          text: object.comment,
          byEmail,
          date: Date.now(),
          emailTitle: emailData.title,
          emailId: emailData.id,
          emailUid: emailData.uid,
          emailType: emailData.type,
          emailAccountId: emailData.emailAccountId,
          interactionId: response.responseData.id,
        })

        if (responseComment.httpStatus === 200 && byEmail === true) {
          await IncomingEmailLink.create({
            emailUid: emailData.uid,
            emailId: emailData.id,
            documentId: response.responseData.id,
            documentType: 'Interaction',
            emailAccountId: emailData.emailAccountId,
          }).catch((error) => {
            console.error(error)
          })

          await IncomingEmail.update({ hasLinks: true }, { where: { id: emailData.id } }).catch(() => {
            console.error(error)
          })
        }
      }

      return res.status(response.httpStatus).send({ id: response.responseData.id })
    }

    return res.status(response.httpStatus).send({ id: response.responseData.id })
  },

  async getAll(req, res, next) {
    try {
      const filter = JSON.parse(req.query.filter || '{}')
      const pagination = JSON.parse(req.query.pagination || '{}')
      const sort = JSON.parse(req.query.sort || '{}')

      let statusFilter = {}

      if (filter.tags) {
        filter.tags = { [Op.like]: `%${filter.tags}%` }
      }

      if (filter.statusFilter) {
        statusFilter = filter.statusFilter

        delete filter.statusFilter
      }

      if (filter.period) {
        const dateFrom = filter.period[0]
        const dateTo = moment(filter.period[1]).endOf('day').toISOString()

        filter.createdAt = { [Op.between]: [dateFrom, dateTo] }
        delete filter.period
      }

      if (filter.searchStr) {
        filter[Op.and] = []
        filter[Op.and].push({ [Op.or]: [{ reference: { [Op.like]: `%${filter.searchStr}%` } }, { numberStr: { [Op.like]: `%${filter.searchStr}%` } }] })
        delete filter.searchStr
      }

      if (filter.orderNumber) {
        let interactionsFilter = []
        const taskOrders = await TaskOrder.findAll({
          include: [
            {
              model: Order,
              as: 'order',
              attributes: ['id', 'numberStr'],
              where: {
                [Op.or]: [{ numberStr: { [Op.iLike]: `%${filter.orderNumber}%` } }, { reference: { [Op.iLike]: `%${filter.orderNumber}%` } }],
              },
            },
            { model: Task, as: 'task', attributes: ['id', 'ownerType', 'ownerId'], where: { ownerType: 'Interaction' } },
          ],
        })

        if (taskOrders) {
          for (let taskOrder of taskOrders) {
            interactionsFilter.push(taskOrder.task.ownerId)
          }
        }

        delete filter.orderNumber

        filter.id = { [Op.in]: interactionsFilter }
      }

      if (req.user.fullRights !== true) {
        const restrictions = await accessService.accessRestrictions(req, Interaction)

        if (restrictions.use === true) {
          const accessUsers = restrictions.users
          if (filter[Op.and]) {
            filter[Op.and].push({ [Op.or]: [{ authorId: accessUsers }, { executorId: accessUsers }] })
          } else {
            filter[Op.or] = [{ authorId: accessUsers }, { executorId: accessUsers }]
          }
        }
      }

      const include = [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name'],
        },
        {
          model: Employee,
          as: 'manager',
          attributes: ['id', 'name'],
        },
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'name'],
        },
        {
          where: statusFilter,
          model: InteractionStatus,
          as: 'status',
          attributes: ['id', 'name', 'color', 'isClosed'],
        },
      ]

      let order = []
      if (sort.sortBy) {
        let sortItem = sort.sortBy.split('.')
        if (sort.sortDesc === true) {
          sortItem.push('DESC')
        }
        order.push(sortItem)
      }

      order.push(['id'])

      const attributes = { exclude: ['customerId', 'authorId', 'statusId'] }

      let interactions

      if (pagination.page) {
        let limit = pagination.limit
        let offset = 0 + (pagination.page - 1) * limit
        interactions = await Interaction.findAndCountAll({
          where: filter,
          offset: offset,
          limit: limit,
          attributes,
          include,
          order,
        })
      } else {
        interactions = await Interaction.findAll({
          where: filter,
          attributes,
          include,
          order,
        })
      }
      if (interactions) {
        for (const item of interactions.rows) {
          const timeTrackingRecords = await TimeTrackingModel.findAll({
            where: {
              objectType: 'interaction',
              objectId: item.dataValues.id,
            },
          })

          let activeTimeTracking = false
          if (timeTrackingRecords.length > 0) {
            for (const timeTrackingRecord of timeTrackingRecords) {
              if (timeTrackingRecord.dataValues.endDate == null) {
                activeTimeTracking = true
              }
              if (timeTrackingRecord.dataValues.userId) {
                const user = await User.findOne({
                  where: {
                    id: timeTrackingRecord.dataValues.userId,
                  },
                })
                if (user) {
                  timeTrackingRecord.dataValues.user = user.dataValues
                }
              }
              item.dataValues.timeTrackingHistory = _.cloneDeep(timeTrackingRecords)
              item.dataValues.activeTimeTracking = activeTimeTracking
            }
          }
        }
      }
      //console.log('interactions', interactions);
      if (interactions) {
        interactions = JSON.stringify(interactions)
        interactions = JSON.parse(interactions)
        res.status(200).send(interactions)
      } else {
        res.status(400).send({ message: 'Interactions not found' })
      }
    } catch (err) {
      console.error(err)
      logger.error('Error in getAllItems Controller', { meta: err })
      return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ message: err })
    }
  },

  async getCount(req, res, next) {
    let filter = JSON.parse(req.query.filter || '{}')

    if (filter.period) {
      const dateFrom = filter.period[0]
      const dateTo = moment(filter.period[1]).endOf('day').toISOString()

      filter.createdAt = { [Op.between]: [dateFrom, dateTo] }
      delete filter.period
    }

    const count = await Interaction.count({ where: filter })
    return res.status(200).send({ count })
  },

  async getDetails(req, res, next) {
    try {
      const includeArray = [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name'],
        },
        {
          model: Employee,
          as: 'manager',
          attributes: ['id', 'name', 'abbreviation'],
        },
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'name', 'email', 'language'],
        },
        {
          model: User,
          as: 'executor',
          attributes: ['id', 'name'],
        },
        {
          model: InteractionStatus,
          as: 'status',
          attributes: ['id', 'name'],
        },
        {
          model: InteractionFile,
          as: 'files',
        },
        {
          model: InteractionComment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'name'],
            },
            {
              model: InteractionCommentFile,
              as: 'files',
            },
          ],
        },
      ]

      let currentInteraction = await Interaction.findByPk(req.params.id, {
        include: includeArray,
      })

      if (currentInteraction) {
        const eventRecords = await Events.findAll({
          where: {
            parentType: 'interaction',
            parentId: req.params.id,
          },
          include: [
            {
              model: EventTypes,
              as: 'eventType',
              attributes: ['id', 'name'],
            },
            {
              model: EventStatuses,
              as: 'eventStatus',
              attributes: ['id', 'name'],
            },
          ],
        })
        currentInteraction.dataValues.events = []
        if (eventRecords.length > 0) {
          for (const event of eventRecords) {
            currentInteraction.dataValues.events.push(event.dataValues)
          }
        }
        currentInteraction = JSON.stringify(currentInteraction)
        currentInteraction = JSON.parse(currentInteraction)
        currentInteraction.tags = JSON.parse(currentInteraction.tags)

        return res.status(200).send(currentInteraction)
      } else {
        return res.status(400).send({ message: 'Interaction not found' })
      }
    } catch (err) {
      logger.error('Error in getItemDetails Controller', { meta: err })
      return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ errorDetails: err })
    }
  },

  async update(req, res, next) {
    try {
      let updateData = { ...req.body }

      if (updateData.tags) {
        updateData.tags = JSON.stringify(updateData.tags)
      }

      const existItem = await Interaction.findByPk(req.params.id)

      if (existItem) {
        const updateItem = await existItem.update(updateData).catch((error) => {
          console.error(error)
          return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ errorDetails: error })
        })

        if (updateItem.executorId && req.user.id !== updateItem.executorId) {
          NotificationService.addChanges(
            {
              objectId: updateItem.id,
              objectName: 'interaction',
              title: `Interakcja ${updateItem.numberStr}`,
              description: 'Zmienione',
              userId: updateItem.executorId,
              read: false,
              type: 'INFO',
            },
            req
          )
        }

        await objectVersionsService.addChanges(
          {
            objectId: req.params.id,
            objectType: 'interaction',
            description: 'Zmieniono',
          },
          req
        )

        return res.status(httpStatus.StatusCodes.OK).send(updateItem)
      } else {
        return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ errorDetails: 'Document not found!' })
      }
    } catch (err) {
      logger.error('Error in updateItem Controller', { meta: err })
      return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ errorDetails: err })
    }
  },

  async updateFile(req, res, next) {
    try {
      let updateData = { ...req.body }

      const existItem = await InteractionFile.findByPk(req.params.id)

      if (existItem) {
        const updateItem = await existItem.update(updateData).catch((error) => {
          console.error(error)
          return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ errorDetails: error })
        })

        return res.status(httpStatus.StatusCodes.OK).send(updateItem)
      } else {
        return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ errorDetails: 'Document not found!' })
      }
    } catch (err) {
      logger.error('Error in updateItem Controller', { meta: err })
      return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ errorDetails: err })
    }
  },

  async changeDeletionMark(req, res, next) {
    const existItem = await Interaction.findByPk(req.body.id)

    if (existItem) {
      const objectData = {
        id: req.body.id,
        markedToDelete: !existItem.markedToDelete,
      }

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

  async addComment(req, res, next) {
    let response
    let { data } = req.body

    let inputData = JSON.parse(data)

    if (req.user) {
      inputData.authorId = req.user.id
    }

    inputData.date = Date.now()

    const existInteraction = await Interaction.findByPk(inputData.interactionId)

    if (existInteraction) {
      response = await documentsService.createItem(InteractionComment, inputData)

      if (response.httpStatus === 200) {
        // add notifacation
        if (existInteraction.executorId && req.user.id !== existInteraction.executorId) {
          NotificationService.addChanges(
            {
              objectId: existInteraction.id,
              objectName: 'interaction',
              title: `Interakcja ${existInteraction.numberStr}`,
              description: 'Dodano komentarż',
              userId: existInteraction.executorId,
              read: false,
              type: 'INFO',
            },
            req
          )
        }
      }

      if (req.files && response.httpStatus === 200) {
        for (let file of req.files) {
          await InteractionCommentFile.create({
            interactionCommentId: response.responseData.id,
            path: file.path,
            filename: file.filename,
            originalname: file.originalname,
            destination: file.destination,
            size: file.size,
            type: file.mimetype,
          }).catch((err) => {
            throw err
          })
        }
      }

      if (inputData.byEmail === true && response.httpStatus === 200) {
        if (inputData.emailType === 'INCOMING') {
          await IncomingEmailLink.create({
            emailUid: inputData.emailUid,
            emailId: inputData.emailId,
            documentId: inputData.interactionId,
            documentType: 'interaction',
            emailAccountId: inputData.emailAccountId,
          }).catch((error) => {
            console.error(error)
          })

          await IncomingEmail.update({ hasLinks: true }, { where: { id: inputData.emailId } }).catch(() => {
            console.error(error)
          })
        } else {
          await OutgoingEmailLink.create({
            emailUid: inputData.emailUid,
            emailId: inputData.emailId,
            documentId: inputData.interactionId,
            documentType: 'interaction',
            emailAccountId: inputData.emailAccountId,
          }).catch((error) => {
            console.error(error)
          })
        }
      }

      return res.status(response.httpStatus).send(response.responseData)
    }
  },

  async delete(req, res, next) {
    let response
    try {
      response = await documentsService.deleteItem(Interaction, req.body.id)
      return res.status(response.httpStatus).send(response)
    } catch (err) {
      logger.error('Error in deleteItem Controller', { meta: err })
      return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ httpStatus: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: err })
    }
  },

  async deleteComment(req, res, next) {
    let response
    try {
      response = await documentsService.deleteItem(InteractionComment, req.params.id)
      return res.status(response.httpStatus).send(response)
    } catch (err) {
      logger.error('Error in deleteItem Controller', { meta: err })
      return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ httpStatus: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: err })
    }
  },

  async attachFiles(req, res) {
    let { data } = req.body
    data = JSON.parse(data)

    const existInteraction = await Interaction.findByPk(data.id)

    if (existInteraction) {
      if (req.files) {
        try {
          for (let file of req.files) {
            await InteractionFile.create({
              interactionId: data.id,
              path: file.path,
              filename: file.filename,
              originalname: file.originalname,
              destination: file.destination,
              size: file.size,
              type: file.mimetype,
            }).catch((err) => {
              throw err
            })
          }

          if (existInteraction.executorId && req.user.id !== existInteraction.executorId) {
            NotificationService.addChanges(
              {
                objectId: existInteraction.id,
                objectName: 'interaction',
                title: `Interakcja ${existInteraction.numberStr}`,
                description: 'Dodano pliki',
                read: false,
                type: 'INFO',
                userId: existInteraction.executorId,
              },
              req
            )
          }

          res.status(200).send({ message: 'OK', id: data.id })
        } catch (err) {
          console.error(err)
          res.status(400).send({ message: err })
        }
      } else {
        res.status(400).send({ message: 'No files' })
      }
    }
  },

  async attachCommentFiles(req, res) {
    let { data } = req.body

    if (req.files) {
      try {
        data = JSON.parse(data)

        for (let file of req.files) {
          await InteractionCommentFile.create({
            interactionCommentId: data.id,
            path: file.path,
            filename: file.filename,
            originalname: file.originalname,
            destination: file.destination,
            size: file.size,
            type: file.mimetype,
          }).catch((err) => {
            throw err
          })
        }

        res.status(200).send({ message: 'OK' })
      } catch (err) {
        console.error(err)
        res.status(400).send({ message: err })
      }
    } else {
      res.status(400).send({ message: 'No files' })
    }
  },

  async getFiles(req, res) {
    const { objectId } = req.body

    if (objectId) {
      await InteractionFile.findAll({ where: { interactionId: objectId } })
        .then((result) => {
          for (let file of result) {
            file.size = (file.size / 1000).toFixed(1)
          }

          res.status(200).send(result)
        })
        .catch((err) => {
          res.status(400).send(err)
        })
    } else {
      res.status(400).send({ message: 'No "objectId" param' })
    }
  },

  async getTasks(req, res) {
    const { objectId } = req.body
    if (objectId) {
      await Task.findAll({
        where: { ownerType: 'Interaction', ownerId: objectId },
        attributes: ['id', 'name', 'number', 'description', 'executionResult', 'authorName', 'createdAt', 'executed'],
        include: [
          {
            model: User,
            as: 'executor',
            attributes: ['id', 'name'],
          },
          {
            model: TaskOrder,
            as: 'orders',
            attributes: ['id'],
            include: [
              {
                model: Order,
                as: 'order',
                attributes: ['id', 'numberStr', 'createdAt', 'reference', 'markedToDelete'],
              },
            ],
          },
          {
            model: TaskFile,
            as: 'files',
          },
        ],
      })
        .then(async (result) => {
          result = JSON.stringify(result)
          result = JSON.parse(result)

          for (let task of result) {
            task.createdAt = moment(task.createdAt).format('DD.MM.YYYY HH:mm:ss')
            for (let orderRow of task.orders) {
              orderRow.order.tasks = []
              await Task.findAll({ where: { orderId: orderRow.order.id }, attributes: ['id', 'number', 'name'] }).then((orderTasks) => {
                if (orderTasks) {
                  orderTasks = JSON.stringify(orderTasks)
                  orderTasks = JSON.parse(orderTasks)

                  for (let orderTask of orderTasks) {
                    orderRow.order.tasks.push({ ...orderTask })
                  }
                }
              })
            }
          }
          res.status(200).send(result)
        })
        .catch((err) => {
          res.status(400).send(err)
        })
    } else {
      res.status(400).send({ message: 'No "objectId" param' })
    }
  },

  async getCommentFiles(req, res) {
    const { objectId } = req.body

    if (objectId) {
      await InteractionCommentFile.findAll({ where: { interactionCommentId: objectId } })
        .then((result) => {
          for (let file of result) {
            file.size = (file.size / 1000).toFixed(1)
          }

          res.status(200).send(result)
        })
        .catch((err) => {
          res.status(400).send(err)
        })
    } else {
      res.status(400).send({ message: 'No "objectId" param' })
    }
  },

  async getFile(req, res) {
    await InteractionFile.findByPk(req.params.id)
      .then((result) => {
        res.download(result.path, result.originalname, (err) => {
          if (err) {
            console.error(err)
          }
        })
      })
      .catch((err) => {
        console.error(err)
        res.status(501).send({ massage: err })
      })
  },

  async getCommentFile(req, res) {
    await InteractionCommentFile.findByPk(req.params.id)
      .then((result) => {
        res.download(result.path, result.originalname, (error) => {
          if (error) {
            console.error(error)
          }
        })
      })
      .catch((error) => {
        console.error(error)
        res.status(501).send({ massage: error })
      })
  },

  async removeFile(req, res) {
    const existFile = await InteractionFile.findByPk(req.params.id)

    if (existFile) {
      //delete from catalog
      await fileService.removeFile(existFile.path)

      await InteractionFile.destroy({ where: { id: req.params.id } })
        .then((result) => {
          res.status(200).send({ message: 'OK' })
        })
        .catch((err) => {
          res.status(400).send(err)
        })
    } else {
      res.status(400).send({ message: 'File not exist!' })
    }
  },

  async removeCommentFile(req, res) {
    const existFile = await InteractionCommentFile.findByPk(req.params.id)

    if (existFile) {
      //delete from catalog
      await fileService.removeFile(existFile.path)

      await InteractionCommentFile.destroy({ where: { id: req.params.id } })
        .then((result) => {
          res.status(200).send({ message: 'OK' })
        })
        .catch((err) => {
          res.status(400).send(err)
        })
    } else {
      res.status(400).send({ message: 'File not exist!' })
    }
  },
}

async function getNextDocumentNumber(newItem) {
  let result = {
    number: 1,
    numberSufix: '',
  }

  const currentYearNumber = Number(new Date().getFullYear())

  result.numberSufix = `/${currentYearNumber}`

  const last = await Interaction.findAll({ where: { numberStr: { [Op.like]: `%${result.numberSufix}` } }, order: [['number', 'DESC']] })

  if (last.length > 0) {
    result.number = ++last[0].number
  }

  return result
}

async function deactivateOtherVersions(currentVersion) {
  const otherVersions = await Interaction.findAll({
    where: {
      state: 'Active',
      versionUuid: currentVersion.versionUuid,
      id: { [Op.ne]: currentVersion.id },
    },
  })
    .then(async (otherVersions) => {
      if (otherVersions) {
        for (let otherVersion of otherVersions) {
          await otherVersion.update({ state: 'Deactive' })
        }
      }
    })
    .catch((error) => {
      console.error(error)
    })
}
