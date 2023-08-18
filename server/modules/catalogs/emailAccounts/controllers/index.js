const commonService = require('@services/commonService')

const EmailAccount = require('../models/emailAccount')
const EmailAccountUser = require('../models/emailAccountUser')
const { Op } = require('sequelize')
const User = require('@catalogs/users/models')
const logger = require('@logging/logger')
const uuidlib = require('uuid')
const cryptoGen = require('@common/auth/cryptoGen')

module.exports = {
  async findAll(req, res, next) {
    const filter = JSON.parse(req.query.filter || '{}')
    const pagination = JSON.parse(req.query.pagination || '{}')
    const sort = JSON.parse(req.query.sort || '{}')

    if (filter.searchStr) {
      filter[Op.or] = [{ name: { [Op.iLike]: `%${filter.searchStr}%` } }]
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

    order.push(['id'])

    const include = [
      {
        model: EmailAccountUser,
        as: 'users',
      },
    ]

    let items = null

    if (pagination.page) {
      let limit = pagination.limit
      let offset = 0 + (pagination.page - 1) * limit
      items = await EmailAccount.findAndCountAll({
        where: filter,
        offset,
        include,
        limit,
        order,
      })
    } else {
      items = await EmailAccount.findAll({
        where: filter,
        include,
        order,
      })
    }

    if (items) {
      items = JSON.stringify(items)
      items = JSON.parse(items)

      if (req.user) {
        if (req.user.fullRights === true) {
          res.status(200).send(items)
        } else {
          const resultEA = []
          if (pagination.page) {
            for (let emailAccount of items.rows) {
              if (emailAccount.isGeneral) {
                resultEA.push(emailAccount)
              } else {
                const eAUser = emailAccount.users.find((el) => {
                  return el.userId === req.user.id
                })

                if (eAUser !== undefined) {
                  resultEA.push(emailAccount)
                }
              }
            }
          } else {
            for (let emailAccount of items) {
              if (emailAccount.isGeneral) {
                resultEA.push(emailAccount)
              } else {
                const eAUser = emailAccount.users.find((el) => {
                  return el.userId === req.user.id
                })

                if (eAUser !== undefined) {
                  resultEA.push(emailAccount)
                }
              }
            }
          }

          res.status(200).send(resultEA)
        }
      } else {
        res.status(200).send([])
      }
    } else {
      console.error(err)
      res.status(400).send({
        message: 'Bad request',
      })
    }
  },

  async findById(req, res, next) {
    let emailAccount = await EmailAccount.findByPk(req.params.id, {
      include: [
        {
          model: EmailAccountUser,
          as: 'users',
          include: [
            {
              model: User,
              attributes: ['id', 'name'],
              as: 'user',
            },
          ],
        },
      ],
    })

    if (emailAccount) {
      res.status(200).send(emailAccount)
    } else {
      res.status(400).send({ message: 'Email account not found' })
    }
  },

  async getSignature(req, res, next) {
    let emailAccount = await EmailAccount.findByPk(req.params.id, { attributes: ['signatures'] })

    if (emailAccount) {
      res.status(200).send(emailAccount.signatures)
    } else {
      res.status(400).send({ message: 'Email account not found' })
    }
  },

  async update(req, res, next) {
    const existEmailAccount = await EmailAccount.findByPk(req.params.id)

    if (existEmailAccount) {
      const { users, ...emailAccountData } = req.body

      if (emailAccountData.password === undefined) {
        delete emailAccountData.password
      } else if (emailAccountData.password === '') {
        emailAccountData.password = null
      } else {
        const passwordHash = cryptoGen.encrypt(emailAccountData.password)
        emailAccountData.password = JSON.stringify(passwordHash)
      }

      if (emailAccountData.presentation) {
        delete emailAccountData.presentation
      }

      await existEmailAccount.update(emailAccountData).catch((error) => {
        logger.error('Error in emailAccounts update controller', { meta: error })
        return res.status(400).send({ message: error })
      })

      await EmailAccountUser.destroy({ where: { emailAccountId: req.params.id } }).catch((error) => {
        logger.error('Error in emailAccounts update controller', { meta: error })
        return res.status(400).send({ message: error })
      })

      for (let userRow of users) {
        await EmailAccountUser.create({ ...userRow, emailAccountId: req.params.id }).catch((error) => {
          logger.error('Error in emailAccounts update controller', { meta: error })
          return res.status(400).send({ message: 'Users row write error' })
        })
      }

      res.status(200).send({ message: 'OK' })
    } else {
      res.status(400).send({ message: 'Email account not found' })
    }
  },

  async delete(req, res, next) {
    const existEmailAccount = await EmailAccount.findByPk(req.params.id)

    if (existEmailAccount) {
      await existEmailAccount.destroy(req.params.id).catch((err) => {
        res.status(400).send({ message: 'Błąd wewnętrzny' })
      })

      res.status(200).send({ message: 'OK' })
    } else {
      res.status(400).send({ message: 'Email account not found' })
    }
  },

  async create(req, res) {
    const { users, ...emailAccountData } = req.body

    if (!emailAccountData.uuid) {
      emailAccountData.uuid = uuidlib.v4()
    }

    if (emailAccountData.presentation) {
      delete emailAccountData.presentation
    }

    if (emailAccountData.password !== '') {
      const passwordHash = cryptoGen.encrypt(emailAccountData.password)
      emailAccountData.password = JSON.stringify(passwordHash)
    } else {
      delete emailAccountData.password
    }
    await EmailAccount.create(emailAccountData)
      .then(async (newEmailAccount) => {
        if (newEmailAccount) {
          for (let userRow of users) {
            await EmailAccountUser.create({ ...userRow, emailAccountId: newEmailAccount.id }).catch((err) => {
              console.error(err)
              res.status(400).send({ message: 'Users row write error' })
            })
          }
        }

        res.status(200).send(newEmailAccount)
      })
      .catch((err) => {
        console.error(err)
        res.status(400).send({ message: 'Email account is not created' })
      })
  },

  async changeDeletionMark(req, res, next) {
    commonService.changeItemDeletionMark(req, res, next, Object)
  },
}
