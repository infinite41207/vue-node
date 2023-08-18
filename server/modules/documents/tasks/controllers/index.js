const { Op } = require('sequelize')
const moment = require('moment')
const config = require('config')
const uuidlib = require('uuid')

const Task = require('../models/task')
const TaskFile = require('../models/taskFile')
const TaskOrder = require('../models/taskOrder')
const ExecutorRole = require('@catalogs/executorRoles/models/executorRole')
const Customer = require('@catalogs/counterparties/models')
const User = require('@catalogs/users/models')
const Order = require('@documents/salesOrders/models/order')
const logger = require('@logging/logger')
const commonService = require('@services/commonService')
const exchangeObjectService = require('@services/exchangeObjectService')
const userRightsService = require('@services/userRightsService')
const fileService = require('@services/fileService')
const emailService = require('@services/emailService')

module.exports = {
  async findAll(req, res, next) {
    try {
      const filter = JSON.parse(req.query.filter || '{}')
      const pagination = JSON.parse(req.query.pagination || '{}')
      const sort = JSON.parse(req.query.sort || '{}')

      if (!req.query.getAllTasks) {
        if (filter.myTasks) {
          filter.authorId = req.user.id
          delete filter.myTasks
        } else if (!filter.ownerType) {
          let executorRoles = []
          executorRoles = await userRightsService.getUserExecutorRoles(req.user.id)

          if (executorRoles.length > 0) {
            const rolesId = executorRoles.map((el) => {
              return el.executorRoleId
            })

            if (filter.showTasksByExecutorRole) {
              filter[Op.or] = [{ executorRoleId: { [Op.in]: rolesId } }, { executorId: req.user.id }]
            } else {
              filter[Op.or] = [{ [Op.and]: [{ executorId: null }, { executorRoleId: { [Op.in]: rolesId } }] }, { executorId: req.user.id }]
            }
          } else {
            filter.executorId = req.user.id
          }
        }

        if (filter.showTasksByExecutorRole) {
          delete filter.showTasksByExecutorRole
        }

        filter.markedToDelete = false
      }

      if (filter.period) {
        const dateFrom = filter.period[0]
        const dateTo = moment(filter.period[1]).endOf('day').toISOString()

        filter.createdAt = { [Op.between]: [dateFrom, dateTo] }
        delete filter.period
      }

      if (filter.searchStr) {
        filter[Op.or] = [{ number: { [Op.iLike]: `%${filter.searchStr}%` } }, { name: { [Op.iLike]: `%${filter.searchStr}%` } }]
        delete filter.searchStr
      }

      const include = [
        {
          model: Customer,
          attributes: ['id', 'name', 'abbreviation', 'deliverySettings'],
          as: 'customer',
        },
        {
          model: ExecutorRole,
          attributes: ['id', 'name'],
          as: 'executorRole',
        },
        {
          model: User,
          attributes: ['id', 'name'],
          as: 'executor',
        },
      ]

      let order = []
      if (sort.sortBy) {
        if (sort.sortBy === 'customer') {
          sort.sortBy = 'customer.name'
        }

        let sortItem = sort.sortBy.split('.')
        if (sort.sortDesc === true) {
          sortItem.push('DESC')
        }
        order.push(sortItem)
      }

      order.push(['id'])

      let attributes = { exclude: ['customerId', 'authorId', 'executorId', 'executorRoleId'] }

      let tasks

      if (pagination.page) {
        let limit = pagination.limit
        let offset = 0 + (pagination.page - 1) * limit

        tasks = await Task.findAndCountAll({
          where: filter,
          offset: offset,
          limit: limit,
          attributes,
          include,
          order,
        })
      } else {
        tasks = await Task.findAll({
          where: filter,
          attributes,
          include,
          order,
        })
      }

      if (tasks) {
        tasks = JSON.stringify(tasks)
        tasks = JSON.parse(tasks)

        if (tasks.rows) {
          for (let task of tasks.rows) {
            if (task.customer) {
              try {
                task.customer.deliverySettings = JSON.parse(task.customer.deliverySettings)
              } catch (error) {
                task.customer.deliverySettings = {}
              }
            }
          }
        } else {
          for (let task of tasks) {
            if (task.customer) {
              try {
                task.customer.deliverySettings = JSON.parse(task.customer.deliverySettings)
              } catch (error) {
                task.customer.deliverySettings = {}
              }
            }
          }
        }

        res.status(200).send(tasks)
      } else {
        console.log(err)
        res.status(400).send({
          message: 'Bad request',
        })
      }
    } catch (err) {
      console.error(err)
      logger.error('Error in tasks.getAllItems Controller', { meta: err })
      return res.status(400).send({ message: err })
    }
  },

  async findById(req, res, next) {
    let currentTask = await Task.findByPk(req.params.id, {
      include: [
        { model: TaskFile, as: 'files' },
        {
          model: TaskOrder,
          as: 'orders',
          include: [{ model: Order, as: 'order', attributes: ['id', 'numberStr', 'createdAt', 'reference', 'markedToDelete'] }],
        },
      ],
    })
    if (currentTask) {
      currentTask = JSON.stringify(currentTask)
      currentTask = JSON.parse(currentTask)

      for (let file of currentTask.files) {
        file.size = (file.size / 1000).toFixed(1)
      }

      if (currentTask.parentTask) {
        await Task.findByPk(currentTask.parentTask)
          .then((parentTask) => {
            currentTask.parentTask = { id: parentTask.id, number: parentTask.number, name: parentTask.name, date: parentTask.date }
          })
          .catch((error) => {
            console.error(error)
          })
      }

      res.status(200).send(currentTask)
    } else {
      res.status(400).send({ message: 'Task not found' })
    }
  },

  async create(req, res) {
    const taskData = { ...req.body }

    await commonService.setAuthor(taskData, req)

    taskData.date = new Date()

    await Task.create(taskData)
      .then(async (newTask) => {
        if (newTask) {
          if (!newTask.number) {
            number = `PI-${newTask.id.toString().padStart(11, '0')}`
            await newTask.update({ number }).catch((err) => {
              res.status(400).send({ message: 'błąd wewnętrzny' })
            })
          }

          const exchangeData = {
            objectId: newTask.id,
            objectName: 'task',
            objectDescription: getTaskPresentation(newTask),
            sent: false,
            changeType: 0,
          }

          if (config.get('erp_exchange.tasks')) {
            await exchangeObjectService.registerToExchange(exchangeData)
          }

          if (newTask) {
            const emailData = {
              sourceType: 'task',
              sourceData: newTask.dataValues,
            }
            emailService.sendEmailNotification(emailData)
          }

          if (taskData.files && taskData.files.length > 0) {
            for (let file of taskData.files) {
              delete file.id
              await TaskFile.create({ ...file, taskId: newTask.id })
            }
          }

          res.status(200).send({ id: newTask.id })
        } else {
          res.status(400).send({ message: 'Task is not created' })
        }
      })
      .catch((err) => {
        console.log(err)
        res.status(400).send({ message: 'Task is not created' })
      })
  },

  async update(req, res, next) {
    const existTask = await Task.findByPk(req.params.id)

    if (existTask) {
      const taskData = { ...req.body }

      await existTask
        .update(taskData)
        .then(async (updateTask) => {
          const exchangeData = {
            objectId: updateTask.id,
            objectName: 'task',
            objectDescription: getTaskPresentation(updateTask),
            sent: false,
            changeType: 1,
          }

          if (config.get('erp_exchange.tasks')) {
            await exchangeObjectService.registerToExchange(exchangeData)
          }

          res.status(200).send({ id: existTask.id })
        })
        .catch((err) => {
          console.error(err)
          res.status(400).send({ message: 'błąd wewnętrzny' })
        })
    } else {
      res.status(400).send({ message: 'Zadanie nie znaleziono' })
    }
  },

  async delete(req, res, next) {
    const existTask = await Task.findByPk(req.params.id)

    if (existTask) {
      await existTask
        .update({ markedToDelete: true })
        .then(async (updateTask) => {
          if (config.get('erp_exchange.tasks')) {
            const exchangeData = {
              objectId: updateTask.id,
              objectName: 'task',
              objectDescription: getTaskPresentation(updateTask),
              sent: false,
              changeType: 1,
            }
            await exchangeObjectService.registerToExchange(exchangeData)
          }

          res.status(200).send({ id: existTask.id })
        })
        .catch((err) => {
          console.error(err)
          res.status(400).send({ message: 'błąd wewnętrzny' })
        })
    } else {
      res.status(400).send({ message: 'Zadanie nie znaleziono' })
    }
  },

  async attachFiles(req, res) {
    let { data } = req.body

    if (req.files) {
      try {
        data = JSON.parse(data)

        for (let file of req.files) {
          await TaskFile.create({
            taskId: data.id,
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
      } catch (error) {
        console.error(error)
        res.status(400).send({ message: error })
      }
    } else {
      res.status(400).send({ message: 'No files' })
    }
  },

  async getFiles(req, res) {
    const { objectId } = req.body

    if (objectId) {
      await TaskFile.findAll({ where: { taskId: objectId } })
        .then((result) => {
          for (let file of result) {
            file.size = (file.size / 1000).toFixed(1)
          }

          res.status(200).send(result)
        })
        .catch((error) => {
          console.error(error)
          res.status(400).send(error)
        })
    } else {
      res.status(400).send({ message: 'No "orderId" param' })
    }
  },

  async getFile(req, res) {
    await TaskFile.findByPk(req.params.id)
      .then((result) => {
        res.download(result.path, result.originalname, (error) => {
          if (error) console.error(error)
        })
      })
      .catch((error) => {
        console.error(error)
        res.status(400).send(error)
      })
  },

  async deleteFile(req, res) {
    const existFile = await TaskFile.findByPk(req.params.id)

    if (existFile) {
      //delete from catalog
      await fileService.removeFile(existFile.path)

      await TaskFile.destroy({ where: { id: req.params.id } })
        .then((result) => {
          res.status(200).send({ message: 'OK' })
        })
        .catch((error) => {
          console.error(error)
          res.status(400).send(error)
        })
    } else {
      res.status(400).send({ message: 'File not exist!' })
    }
  },

  async execute(req, res, next) {
    const updateData = {
      executed: true,
      executionResult: req.body.executionResult,
      executionDate: Date.now(),
      executorId: req.user.id,
      executorName: req.user.name,
    }

    const currentTask = await Task.findByPk(req.params.id)

    if (currentTask) {
      updateData.executionHistory = `${!currentTask.executionHistory ? '' : `${currentTask.executionHistory}\n\n`}[${moment().format('DD.MM.YYYY HH:MM')}] ${
        req.user.name
      }:\nWykonał zadanie`

      if (updateData.executionResult !== null) {
        updateData.executionHistory += `\nWynik:\n${updateData.executionResult}`
      }

      await currentTask
        .update(updateData)
        .then(async (updateTask) => {
          if (updateTask.checkExecution === true) {
            await createTaskForCheckExecution(updateTask, req)
          }

          const exchangeData = {
            objectId: updateTask.id,
            objectName: 'task',
            objectDescription: getTaskPresentation(updateTask),
            sent: false,
            changeType: 1,
          }

          if (config.get('erp_exchange.tasks')) {
            await exchangeObjectService.registerToExchange(exchangeData)
          }

          res.status(200).send(updateTask)
        })
        .catch((error) => {
          console.error(error)
          return res.status(400).send({ message: `Błąd wewnętrzny: ${error}` })
        })
    } else {
      res.status(400).send({ message: 'Task not found' })
    }
  },

  async acceptExecution(req, res, next) {
    const updateData = {
      executionAccepted: true,
      executionAcceptanceDate: Date.now(),
      executorId: req.user.id,
      executorName: req.user.name,
    }

    const currentTask = await Task.findByPk(req.params.id)

    if (currentTask) {
      if (currentTask.executionAccepted === true) {
        return res.status(400).send({ message: `Zadanie już przyjęte do wykonania przez ${currentTask.executorName}.` })
      }

      updateData.executionHistory = `${!currentTask.executionHistory ? '' : `${currentTask.executionHistory}\n\n`}[${moment().format('DD.MM.YYYY HH:MM')}] ${
        req.user.name
      }:\nPrzyjął zadanie do wykonania`

      const updateTask = await currentTask.update(updateData).catch((err) => {
        res.status(400).send({ message: 'błąd wewnętrzny' })
      })

      const exchangeData = {
        objectId: updateTask.id,
        objectName: 'task',
        objectDescription: getTaskPresentation(updateTask),
        sent: false,
        changeType: 1,
      }

      if (config.get('erp_exchange.tasks')) {
        await exchangeObjectService.registerToExchange(exchangeData)
      }

      res.status(200).send(updateTask)
    } else {
      res.status(400).send({ message: 'Task not found' })
    }
  },
}

function getTaskPresentation(taskData) {
  const createdAt = moment(taskData.createdAt).format('DD MM YYYY HH:mm:ss')

  return `Zadanie nr ${taskData.number} od ${createdAt}`
}

async function createTaskForCheckExecution(parentTask, req) {
  const date = new Date()

  const newTask = {
    id: null,
    number: '',
    date: date,
    name: `Zweryfikuj: ${parentTask.name}`,
    started: true,
    executed: false,
    description: parentTask.description,
    uuid: uuidlib.v4(),
    customerId: parentTask.customerId,
    executorRoleId: null,
    executorId: req.user.id,
    taskTemplateId: null,
    executorName: req.user.name,
    importance: 'NOT_SET',
    authorId: req.user.id,
    authorName: req.user.name,
    emailTitle: '',
    emailBody: '',
    emailFrom: '',
    orderId: parentTask.orderId,
    fromErp: false,
    subjectString: parentTask.subjectString,
    executionAccepted: false,
    markedToDelete: false,
    emailBodyType: 'html',
    executionPeriod: date.setDate(date.getDate() + 1),
    parentTask: parentTask.id,
    checkExecution: false,
    checker: null,
    checkResult: true,
    executionHistory: parentTask.executionHistory,
    executionResult: parentTask.executionResult,
    bpDefinition: null,
    ownerType: parentTask.ownerType,
    ownerId: parentTask.ownerId,
    files: [],
    orders: [],
  }

  await Task.create(newTask)
    .then(async (createdTask) => {
      if (createdTask) {
        if (!createdTask.number) {
          number = `PI-${createdTask.id.toString().padStart(11, '0')}`
          await createdTask.update({ number }).catch((err) => {
            console.error(err)
          })
        }
      }
    })
    .catch((err) => {
      console.error(err)
    })
}
