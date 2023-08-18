const Notification = require('../models')
const User = require('@catalogs/users/models')

module.exports = {
  async findAll(req, res, next) {
    const filter = { ...req.query }

    filter.userId = req.user ? req.user.id : null

    let notifications = await Notification.findAll({
      where: filter,
      include: [{ model: User, as: 'user', attributes: ['name'] }],
      order: ['id'],
    })

    if (notifications) {
      notifications = JSON.stringify(notifications)
      notifications = JSON.parse(notifications)

      res.status(200).send(notifications)
    } else {
      console.error(err)
      res.status(400).send({
        message: 'Bad request',
      })
    }
  },

  async findById(req, res, next) {
    const notification = await Notification.findByPk(req.params.id)

    if (notification) {
      res.status(200).send(notification)
    } else {
      res.status(400).send({ message: 'Notification not find' })
    }
  },

  async update(req, res, next) {
    const existNotification = await Notification.findByPk(req.params.id)

    if (existNotification) {
      const updateData = req.body
      await existNotification.update(updateData).catch((err) => {
        res.status(400).send({ message: 'Błąd wewnętrzny' })
      })

      res.status(200).send({ message: 'OK' })
    } else {
      res.status(400).send({ message: 'Notification not found' })
    }
  },
}
