const documentsService = require('@services/documentsService')
const httpStatus = require('http-status-codes')
const logger = require('@logging/logger')
const CustomerRequest = require('../models/customerRequest')
const CustomerRequestComment = require('../models/customerRequestComment')
const CustomerRequestStatus = require('@catalogs/customerRequestStatuses/models')
const CustomerRequestFile = require('../models/customerRequestFile')
const CustomerRequestCommentFile = require('../models/customerRequestCommentFile')
const Customer = require('@catalogs/counterparties/models')
const Order = require('@documents/salesOrders/models/order')
const User = require('@catalogs/users/models')
const Employee = require('@catalogs/employees/models')
const IncomingEmailLink = require('@documents/incomingEmails/models/incomingEmailLink')
const IncomingEmail = require('@documents/incomingEmails/models')
const OutgoingEmailLink = require('@documents/outgoingEmails/models/outgoingEmailLink')
const OutgoingEmail = require('@documents/outgoingEmails/models')
const NotificationService = require('@services/notificationService')
const moment = require('moment')

const { Op, fn, cast, col, literal } = require('sequelize')
const uuidlib = require('uuid')
const fileService = require('@services/fileService')
const objectVersionsService = require('@services/objectVersionsService')
const accessService = require('@services/userAccessService')

const zeroPad = (num, places) => String(num).padStart(places, '0')

module.exports = {
  async create(req, res, next) {
    let response

    let newItem = { ...req.body }
    newItem.markedToDelete = false
    newItem.state = 'Active'
    newItem.prefix = 'ZO'
    newItem.uuid = uuidlib.v4()
    newItem.date = Date.now()

    if (req.user) {
      newItem.authorId = req.user.id
    }

    let deactivateOtherWersions = false
    if (newItem.versionUuid === '') {
      newItem.version = 1
      newItem.versionUuid = uuidlib.v4()

      const newDocumentNumber = await getNextDocumentNumber(newItem)

      newItem.number = newDocumentNumber.number
      newItem.numberStr = `${newItem.prefix}/${zeroPad(newDocumentNumber.number, 5)}${newDocumentNumber.numberPrefix}`
    } else {
      checkVersionNumber(newItem)

      await updateDocumentNumberStr(newItem, new Date(), newItem.prefix, newItem.number)
      deactivateOtherWersions = true
    }

    newItem.tags = JSON.stringify(newItem.tags)
    console.log('new item', newItem)

    response = await documentsService.createItem(CustomerRequest, newItem)

    if (response.httpStatus === 200) {
      // add notifacation
      if (response.responseData.constructorId && req.user.id !== response.responseData.constructorId) {
        NotificationService.addChanges(
          {
            objectId: response.responseData.id,
            objectName: 'customer_request',
            title: `Zapytanie ofertowe ${response.responseData.numberStr}`,
            description: 'Dodano nowy',
            read: false,
            type: 'INFO',
            userId: response.responseData.constructorId,
          },
          req
        )
      }

      if (deactivateOtherWersions === true) {
        deactivateOtherVersions(response.responseData)
      }

      newItem.customerRequestId = response.responseData.id
      newItem.date = Date.now()
      const { authorId, customerRequestId, comment, byEmail, emailUid, emailId, emailTitle, emailAccountId, emailType } = newItem

      await objectVersionsService.addChanges(
        {
          objectId: newItem.customerRequestId,
          objectName: 'customerRequest',
          description: 'Stworzono',
        },
        req
      )

      if (response.httpStatus === 200 && (byEmail === true || comment.length > 0)) {
        const responseComment = await documentsService.createItem(CustomerRequestComment, {
          authorId,
          text: comment,
          byEmail,
          emailTitle,
          emailUid,
          emailId,
          emailAccountId,
          customerRequestId,
          emailType,
        })

        if (responseComment.httpStatus === 200 && byEmail === true) {
          await IncomingEmailLink.create({
            emailUid: emailUid,
            emailId: emailId,
            documentId: response.responseData.id,
            documentType: 'customerRequest',
            emailAccountId,
          }).catch((error) => {
            console.error(error)
          })

          await IncomingEmail.update({ hasLinks: true }, { where: { id: emailId } }).catch(() => {
            console.error(error)
          })
        }

        return res.status(response.httpStatus).send({ id: response.responseData.id, commentId: responseComment.responseData.id })
      }
    }

    return res.status(response.httpStatus).send({ id: response.responseData.id })
  },

  async getAll(req, res, next) {
    try {
      const filter = JSON.parse(req.query.filter || '{}')
      const pagination = JSON.parse(req.query.pagination || '{}')
      const sort = JSON.parse(req.query.sort || '{}')

      let statusFilter = {}

      if (filter.isConstructor) {
        filter[Op.or] = [{ constructorId: req.user.id }, { executorId: req.user.id }]

        delete filter.isConstructor
      }

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

      if (req.user.fullRights !== true) {
        const restrictions = await accessService.accessRestrictions(req, CustomerRequest)

        if (restrictions.use === true) {
          const accessUsers = restrictions.users
          if (filter[Op.and]) {
            filter[Op.and].push({ [Op.or]: [{ authorId: accessUsers }, { executorId: accessUsers }, { constructorId: accessUsers }] })
          } else {
            filter[Op.or] = [{ authorId: accessUsers }, { executorId: accessUsers }, { constructorId: accessUsers }]
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
          model: User,
          as: 'constr',
          attributes: ['id', 'name'],
        },
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'name'],
        },
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'prefix', 'number', 'numberStr', 'createdAt'],
        },
        {
          where: statusFilter,
          model: CustomerRequestStatus,
          as: 'status',
          attributes: ['id', 'name', 'color', 'isClosed'],
        },
        {
          model: OutgoingEmail,
          as: 'resultEmail',
          attributes: ['id', 'subject', 'fromId'],
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

      let customerRequests

      if (pagination.page) {
        let limit = pagination.limit
        let offset = 0 + (pagination.page - 1) * limit
        customerRequests = await CustomerRequest.findAndCountAll({
          where: filter,
          offset: offset,
          limit: limit,
          attributes,
          include,
          order,
        })
      } else {
        customerRequests = await CustomerRequest.findAll({
          where: filter,
          attributes,
          include,
          order,
        })
      }

      if (customerRequests) {
        customerRequests = JSON.stringify(customerRequests)
        customerRequests = JSON.parse(customerRequests)
        res.status(200).send(customerRequests)
      } else {
        res.status(400).send({ message: 'Customer requests not found' })
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

    const count = await CustomerRequest.count({ where: filter })
    return res.status(200).send({ count })
  },

  async getAmount(req, res, next) {
    let filter = JSON.parse(req.query.filter || '{}')

    if (filter.period) {
      const dateFrom = filter.period[0]
      const dateTo = moment(filter.period[1]).endOf('day').toISOString()

      filter.createdAt = { [Op.between]: [dateFrom, dateTo] }
      delete filter.period
    }

    const params = {
      attributes: [
        [fn('SUM', cast(col('sumBrutto'), 'decimal')), 'totalAmount'],
      ]
    }

    const group = req.query.group
    if(group === 'month' || group === 'day') {
      params.attributes.push([fn('date_trunc', group, col('createdAt')), 'group'])
      params.order = [[literal('"group"'), 'ASC']]
      params.group = 'group'
    }

    if(group === 'manager') {
      params.include = ['manager']
      params.order = [[literal('"totalAmount"'), 'DESC']]
      params.group = 'manager.id'
      params.limit = 5
      filter.managerId = { [Op.not]: null }
    }

    if(group === 'customer') {
      params.include = ['customer']

      params.attributes.push('customerName')
      params.attributes.push([fn('COUNT', col('customer.id')), 'quantity'])
      // params.attributes.push([fn('avg', col('sumBrutto')), 'price'])

      params.order = [[literal('"totalAmount"'), 'DESC']]
      params.group = ['customer.id', 'customerName']
      params.limit = 5
      filter.customerId = { [Op.not]: null }
    }

    params.where = filter

    const response = await CustomerRequest.findAll(params)

    return res.status(200).send({ count: group ? response : response[0] })
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
          model: User,
          as: 'constr',
          attributes: ['id', 'name'],
        },
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'name', 'email', 'language'],
        },
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'prefix', 'number', 'numberStr', 'createdAt'],
        },
        {
          model: User,
          as: 'executor',
          attributes: ['id', 'name'],
        },
        {
          model: CustomerRequestStatus,
          as: 'status',
          attributes: ['id', 'name'],
        },
        {
          model: OutgoingEmail,
          as: 'resultEmail',
          attributes: ['id', 'subject', 'fromId'],
        },
        {
          model: CustomerRequestFile,
          as: 'files',
        },
        {
          model: CustomerRequestComment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'name'],
            },
            {
              model: CustomerRequestCommentFile,
              as: 'files',
            },
          ],
        },
      ]

      let currentCustomerRequest = await CustomerRequest.findByPk(req.params.id, {
        include: includeArray,
        order: [[{ model: CustomerRequestComment, as: 'comments' }, 'id', 'ASC']],
      })

      if (currentCustomerRequest) {
        currentCustomerRequest = JSON.stringify(currentCustomerRequest)
        currentCustomerRequest = JSON.parse(currentCustomerRequest)

        currentCustomerRequest.tags = JSON.parse(currentCustomerRequest.tags)

        let files = []
        let forCustomerFiles = []
        let fromCustomerFiles = []
        let calculationFiles = []

        let accessFilesStr = ''
        if (req.user) {
          let userData = await User.findByPk(req.user.id, { attributes: ['accessFiles'] })
          if (userData) {
            userData = JSON.stringify(userData)
            userData = JSON.parse(userData)
            if (userData.accessFiles) {
              accessFilesStr = userData.accessFiles
            }
          }
        }

        let haveFileAccess = false
        let accesFiles = []
        if (accessFilesStr !== '') {
          haveFileAccess = true
          accesFiles = accessFilesStr.replace(/\s/g, '').split(',')
        }

        for (let file of currentCustomerRequest.files) {
          if (haveFileAccess === true && accesFiles.includes(file.type)) {
            console.log('no have access to file', file.type)
            continue
          }

          if (file.fileDestination === 'FOR_CUSTOMER') {
            forCustomerFiles.push(file)
          } else if (file.fileDestination === 'FROM_CUSTOMER') {
            fromCustomerFiles.push(file)
          } else if (file.fileDestination === 'CALCULATION') {
            calculationFiles.push(file)
          } else {
            files.push(file)
          }
        }

        currentCustomerRequest.forCustomerFiles = forCustomerFiles
        currentCustomerRequest.fromCustomerFiles = fromCustomerFiles
        currentCustomerRequest.calculationFiles = calculationFiles
        currentCustomerRequest.files = files

        return res.status(200).send(currentCustomerRequest)
      } else {
        return res.status(400).send({ message: 'Customer request not found' })
      }
    } catch (err) {
      logger.error('Error in getItemDetails Controller', { meta: err })
      return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ errorDetails: err })
    }
  },

  async update(req, res, next) {
    try {
      let updateData = { ...req.body }
      if (updateData.presentation) {
        delete updateData.presentation
      }

      if (updateData.tags) {
        updateData.tags = JSON.stringify(updateData.tags)
      }

      const existItem = await CustomerRequest.findByPk(req.params.id)

      if (existItem) {
        if (updateData.constructorId && existItem.constructorId !== updateData.constructorId) {
          await updateDocumentNumberStr(updateData, existItem.createdAt, existItem.prefix, existItem.number)
        }

        const updateItem = await existItem.update(updateData).catch((error) => {
          console.error(error)
          return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ errorDetails: error })
        })

        if (updateItem.constructorId && req.user.id !== updateItem.constructorId) {
          NotificationService.addChanges(
            {
              objectId: updateItem.id,
              objectName: 'customer_request',
              title: `Zapytanie ofertowe ${updateItem.numberStr}`,
              description: 'Zmienione',
              userId: updateItem.constructorId,
              read: false,
              type: 'INFO',
            },
            req
          )
        }

        await objectVersionsService.addChanges(
          {
            objectId: req.params.id,
            objectName: 'customerRequest',
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

  async changeDeletionMark(req, res) {
    const existCustomerRequest = await CustomerRequest.findByPk(req.body.id)

    if (existCustomerRequest) {
      const newMarkedToDelete = !existCustomerRequest.markedToDelete
      let newData = {
        markedToDelete: newMarkedToDelete,
      }

      await existCustomerRequest
        .update(newData)
        .then(async (updatedObject) => {
          const changesData = {
            objectId: updatedObject.id,
            objectName: 'customerRequest',
            description: newMarkedToDelete ? 'Zaznaczono do usunięcia' : 'Przewrócono',
          }

          await objectVersionsService.addChanges(changesData, req)
          res.status(200).send({ message: 'OK' })
        })
        .catch((err) => {
          res.status(400).send({ message: err })
        })
    } else {
      res.status(400).send({ message: 'Dokument nie znaleziony' })
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

    const existCustomerRequest = await CustomerRequest.findByPk(inputData.customerRequestId)

    if (existCustomerRequest) {
      response = await documentsService.createItem(CustomerRequestComment, inputData)

      if (response.httpStatus === 200) {
        // add notifacation
        if (existCustomerRequest.constructorId && req.user.id !== existCustomerRequest.constructorId) {
          NotificationService.addChanges(
            {
              objectId: existCustomerRequest.id,
              objectName: 'customer_request',
              title: `Zapytanie ofertowe ${existCustomerRequest.numberStr}`,
              description: 'Dodano komentarż',
              userId: existCustomerRequest.constructorId,
              read: false,
              type: 'INFO',
            },
            req
          )
        }
      }

      if (req.files && response.httpStatus === 200) {
        for (let file of req.files) {
          await CustomerRequestCommentFile.create({
            cRCommentId: response.responseData.id,
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
            documentId: inputData.customerRequestId,
            documentType: 'customerRequest',
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
            documentId: inputData.customerRequestId,
            documentType: 'customerRequest',
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
      response = await documentsService.deleteItem(CustomerRequest, req.body.id)
      return res.status(response.httpStatus).send(response)
    } catch (err) {
      logger.error('Error in deleteItem Controller', { meta: err })
      return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ httpStatus: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: err })
    }
  },

  async deleteComment(req, res, next) {
    let response
    try {
      response = await documentsService.deleteItem(CustomerRequestComment, req.params.id)
      return res.status(response.httpStatus).send(response)
    } catch (err) {
      logger.error('Error in deleteItem Controller', { meta: err })
      return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ httpStatus: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR, status: 'failed', errorDetails: err })
    }
  },

  async attachCRFiles(req, res) {
    let { data } = req.body
    data = JSON.parse(data)

    const existCustomerRequest = await CustomerRequest.findByPk(data.id)

    if (existCustomerRequest) {
      if (req.files) {
        try {
          for (let file of req.files) {
            await CustomerRequestFile.create({
              customerRequestId: data.id,
              fileDestination: data.fileDestination,
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

          if (existCustomerRequest.constructorId && req.user.id !== existCustomerRequest.constructorId) {
            NotificationService.addChanges(
              {
                objectId: existCustomerRequest.id,
                objectName: 'customer_request',
                title: `Zapytanie ofertowe ${existCustomerRequest.numberStr}`,
                description: 'Dodano pliki',
                read: false,
                type: 'INFO',
                userId: existCustomerRequest.constructorId,
              },
              req
            )
          }

          res.status(200).send({ message: 'OK' })
        } catch (err) {
          console.log(err)
          res.status(400).send({ message: err })
        }
      } else {
        res.status(400).send({ message: 'No files' })
      }
    }
  },

  async attachCRCommentFiles(req, res) {
    let { data } = req.body

    if (req.files) {
      try {
        data = JSON.parse(data)

        for (let file of req.files) {
          await CustomerRequestCommentFile.create({
            cRCommentId: data.id,
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
        console.log(err)
        res.status(400).send({ message: err })
      }
    } else {
      res.status(400).send({ message: 'No files' })
    }
  },

  async getCRFiles(req, res) {
    const { objectId } = req.body

    if (objectId) {
      await CustomerRequestFile.findAll({ where: { customerRequestId: objectId } })
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

  async getByNumber(req, res) {
    const { numberStr } = req.body

    await CustomerRequest.findAll({
      where: { numberStr, state: 'Active' },
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'name', 'uuid'],
        },
        {
          model: Employee,
          as: 'manager',
          attributes: ['id', 'name', 'uuid'],
        },
        {
          model: User,
          as: 'constr',
          attributes: ['id', 'name'],
        },
        {
          model: CustomerRequestFile,
          as: 'files',
        },
      ],
    })
      .then(async (customerRequests) => {
        customerRequests = JSON.stringify(customerRequests)
        customerRequests = JSON.parse(customerRequests)

        for (let customerRequest of customerRequests) {
          customerRequest.constructor = { ...customerRequest.constr }
          delete customerRequest.constr
        }

        if (customerRequests.length === 0) {
          res.status(400).send({ message: 'Customer request with order not found!' })
        } else {
          res.status(200).send(customerRequests[0])
        }
      })
      .catch((error) => {
        res.status(400).send(error)
      })
  },

  async getCRFilesByNumber(req, res) {
    const { numberStr } = req.body

    await CustomerRequest.findAll({ where: { numberStr, state: 'Active' } })
      .then(async (customerRequests) => {
        customerRequests = JSON.stringify(customerRequests)
        customerRequests = JSON.parse(customerRequests)

        if (customerRequests.length === 1) {
          await CustomerRequestFile.findAll({ where: { customerRequestId: customerRequests[0].id } })
            .then((result) => {
              res.status(200).send(result)
            })
            .catch((error) => {
              res.status(400).send(error)
            })
        } else {
          res.status(400).send({ message: 'Customer request with order not found!' })
        }
      })
      .catch((error) => {
        res.status(400).send(error)
      })
  },

  async getCRCommentFiles(req, res) {
    const { objectId } = req.body

    if (objectId) {
      await CustomerRequestCommentFile.findAll({ where: { cRCommentId: objectId } })
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

  async getCRFile(req, res) {
    await CustomerRequestFile.findByPk(req.params.id)
      .then((result) => {
        res.download(result.path, result.originalname, (err) => {
          if (err) {
            console.log(err)
          }
        })
      })
      .catch((err) => {
        console.log(err)
        res.status(501)
      })
  },

  async getCRCommentFile(req, res) {
    await CustomerRequestCommentFile.findByPk(req.params.id)
      .then((result) => {
        res.download(result.path, result.originalname, (err) => {
          if (err) {
            console.log(err)
          }
        })
      })
      .catch((err) => {
        console.log(err)
        res.status(501)
      })
  },

  async removeCRFile(req, res) {
    const existFile = await CustomerRequestFile.findByPk(req.params.id)

    if (existFile) {
      //delete from catalog
      await fileService.removeFile(existFile.path)

      await CustomerRequestFile.destroy({ where: { id: req.params.id } })
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

  async removeCRCommentFile(req, res) {
    const existFile = await CustomerRequestCommentFile.findByPk(req.params.id)

    if (existFile) {
      //delete from catalog
      await fileService.removeFile(existFile.path)

      await CustomerRequestCommentFile.destroy({ where: { id: req.params.id } })
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
    numberPrefix: '',
  }

  const currentYearNumber = Number(new Date().getFullYear())

  let constructorAbbr = null
  if (newItem.constructorId > 0) {
    const constructor = await User.findByPk(newItem.constructorId)
    if (constructor) {
      constructorAbbr = constructor.abbreviation ? constructor.abbreviation : null
    }
  }

  result.numberPrefix = constructorAbbr ? `/${constructorAbbr}/${currentYearNumber}` : `/${currentYearNumber}`

  const prefixForNumber = `/${currentYearNumber}`
  const lastCR = await CustomerRequest.findAll({ where: { numberStr: { [Op.like]: `%${prefixForNumber}` } }, order: [['number', 'DESC']] })

  if (lastCR.length > 0) {
    result.number = ++lastCR[0].number
  }

  return result
}

async function updateDocumentNumberStr(docData, createdAt, prefix, number) {
  const yearNumber = Number(new Date(createdAt).getFullYear())

  let constructorAbbr = null
  if (docData.constructorId > 0) {
    const constructor = await User.findByPk(docData.constructorId)
    if (constructor) {
      constructorAbbr = constructor.abbreviation ? constructor.abbreviation : null
    }
  }

  const numberSufix = constructorAbbr ? `/${constructorAbbr}/${yearNumber}` : `/${yearNumber}`
  docData.numberStr = `${prefix}/${zeroPad(number, 5)}${numberSufix}`
}

async function deactivateOtherVersions(currentVersion) {
  const otherVersions = await CustomerRequest.findAll({
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

async function checkVersionNumber(newItem) {
  await CustomerRequest.findAll({ where: { number: newItem.number }, order: [['version', 'DESC']] })
    .then((existVersions) => {
      if (existVersions) {
        if (existVersions.length > 0) {
          let lastVersion = existVersions[0].version

          if (newItem.version <= lastVersion) {
            console.log('correct version')
            newItem.version = ++lastVersion
          }
        }
      }
    })
    .catch((error) => {
      console.error(error)
    })
}
