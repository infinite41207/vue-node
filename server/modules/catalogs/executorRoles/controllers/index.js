const catalogService = require('@services/catalogsService')
const httpStatus = require('http-status-codes')
const logger = require('@logging/logger')
const ExecutorRole = require('../models/executorRole')
const User = require('@catalogs/users/models')
const TaskExecutor = require('../models/taskExecutor')
const uuidlib = require('uuid')

module.exports = {
  async findAll(req, res, next) {
    let filter = {}

    if (req.query.filter) {
      filter = JSON.parse(req.query.filter)
    }

    const executorRoles = await ExecutorRole.findAll({ where: filter, order: ['name'] })

    if (executorRoles) {
      res.status(httpStatus.StatusCodes.OK).send(executorRoles)
    } else {
      console.error(err)
      res.status(httpStatus.StatusCodes.BAD_REQUEST).send({
        message: 'Bad request',
      })
    }
  },

  async findById(req, res, next) {
    const existExecutorRole = await ExecutorRole.findByPk(req.params.id, {
      include: { model: TaskExecutor, as: 'executors', include: { model: User, as: 'executor' } },
    })

    if (existExecutorRole) {
      res.status(httpStatus.StatusCodes.OK).send(existExecutorRole)
    } else {
      res.status(httpStatus.StatusCodes.BAD_REQUEST).send({ message: 'Produkt nie znaleziony' })
    }
  },

  async update(req, res, next) {
    const existExecutorRole = await ExecutorRole.findByPk(req.params.id)

    if (existExecutorRole) {
      const { executors, ...executorRoleData } = req.body

      if (executorRoleData.presentation) {
        delete executorRoleData.presentation
      }

      await existExecutorRole.update(executorRoleData).catch((err) => {
        res.status(httpStatus.StatusCodes.BAD_REQUEST).send({ message: 'Błąd wewnętrzny' })
      })

      await TaskExecutor.destroy({ where: { executorRoleId: req.params.id } }).catch((err) => {
        res.status(httpStatus.StatusCodes.BAD_REQUEST).send({ message: 'błąd wewnętrzny' })
      })

      for (let executorRow of executors) {
        await TaskExecutor.create({ ...executorRow, executorRoleId: req.params.id }).catch((err) => {
          console.error(err)
          res.status(httpStatus.StatusCodes.BAD_REQUEST).send({ message: 'Users row write error' })
        })
      }

      res.status(httpStatus.StatusCodes.OK).send({ message: 'OK' })
    } else {
      res.status(httpStatus.StatusCodes.BAD_REQUEST).send({ message: 'Email account not found' })
    }
  },

  async remove(req, res, next) {
    const existExecutorRole = await ExecutorRole.findByPk(req.params.id)

    if (existExecutorRole) {
      await existExecutorRole.destroy(req.params.id).catch((err) => {
        res.status(httpStatus.StatusCodes.BAD_REQUEST).send({ message: 'Błąd wewnętrzny' })
      })

      res.status(httpStatus.StatusCodes.OK).send({ message: 'OK' })
    } else {
      res.status(httpStatus.StatusCodes.BAD_REQUEST).send({ message: 'Email account not found' })
    }
  },

  async create(req, res) {
    const { executors, ...executorRoleData } = req.body

    if (!executorRoleData.uuid) {
      executorRoleData.uuid = uuidlib.v4()
    }

    if (executorRoleData.presentation) {
      delete executorRoleData.presentation
    }

    await ExecutorRole.create(executorRoleData)
      .then(async (newExecutorRole) => {
        if (newExecutorRole) {
          for (let executorRow of executors) {
            await TaskExecutor.create({ ...executorRow, executorRoleId: newExecutorRole.id }).catch((err) => {
              console.error(err)
              res.status(httpStatus.StatusCodes.BAD_REQUEST).send({ message: 'Executor row write error' })
            })
          }
        }

        res.status(httpStatus.StatusCodes.OK).send(newExecutorRole)
      })
      .catch((err) => {
        console.error(err)
        res.status(httpStatus.StatusCodes.BAD_REQUEST).send({ message: 'Executor role is not created' })
      })
  },
}
