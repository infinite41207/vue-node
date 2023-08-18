const TaskTemplate = require('../models')
const ExecutorRole = require('@catalogs/executorRoles/models/executorRole')
const User = require('@catalogs/users/models')
const uuidlib = require('uuid')

module.exports = {
  async findAll(req, res, next) {
    const filter = JSON.parse(req.query.filter || '{}')

    const taskTemplates = await TaskTemplate.findAll({
      where: filter,
      attributes: { exclude: ['executorId', 'executorRoleId'] },
      include: [
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
      ],

      order: ['id'],
    })

    if (taskTemplates) {
      res.status(200).send(taskTemplates)
    } else {
      console.error(err)
      res.status(400).send({
        message: 'Bad request',
      })
    }
  },

  async findById(req, res, next) {
    let existTaskTemplate = await TaskTemplate.findByPk(req.params.id, {
      include: [
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
      ],
    })

    if (existTaskTemplate) {
      res.status(200).send(existTaskTemplate)
    } else {
      res.status(400).send({ message: 'Task template not found' })
    }
  },
}
