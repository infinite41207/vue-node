const ObjectModel = require('../models/index')
const RoleGroupSetting = require('../models/roleGroupSetting')
const RoleGroupUser = require('../models/roleGroupUser')
const User = require('@catalogs/users/models')
const UserRole = require('@catalogs/userRoles/models')
const _ = require('lodash')
const { Op, Sequelize } = require('sequelize')
const uuidlib = require('uuid')

module.exports = {
  async findAll(req, res, next) {
    const filter = JSON.parse(req.query.filter || '{}')
    const pagination = JSON.parse(req.query.pagination || '{}')
    const sort = JSON.parse(req.query.sort || '{}')

    if (filter.searchStr) {
      filter.name = {
        [Op.iLike]: `%${filter.searchStr}%`,
      }
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

    let items
    if (pagination.page) {
      let limit = pagination.limit
      let offset = 0 + (pagination.page - 1) * limit
      items = await ObjectModel.findAndCountAll({
        where: filter,
        offset: offset,
        limit: limit,
        order: order,
      })
    } else {
      items = await ObjectModel.findAll({
        where: filter,
        order: order,
      })
    }

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
    await ObjectModel.findByPk(req.params.id, {
      include: [
        {
          model: RoleGroupSetting,
          as: 'settings',
          include: [{ model: UserRole, as: 'userRole', attributes: ['id', 'name'] }],
        },
        {
          model: RoleGroupUser,
          as: 'users',
          include: [{ model: User, as: 'user', attributes: ['name'] }],
        },
      ],
    })
      .then((result) => {
        if (result) {
          res.status(200).send(result)
        } else {
          res.status(400).send({ message: 'Role group is not found' })
        }
      })
      .catch((error) => {
        res.status(400).send({ message: error })
        console.error(error)
      })
  },

  async create(req, res) {
    const { settings, users, ...roleGroupData } = req.body

    if (!roleGroupData.uuid) {
      roleGroupData.uuid = uuidlib.v4()
    }

    if (roleGroupData.presentation) {
      delete roleGroupData.presentation
    }

    await ObjectModel.create(roleGroupData)
      .then(async (newRoleGroup) => {
        try {
          for (let settingRow of settings) {
            await RoleGroupSetting.create({ ...settingRow, roleGroupId: newRoleGroup.id }).catch((err) => {
              console.error(err)
              throw new Error('Settings row write error')
            })
          }

          for (let userRow of users) {
            await RoleGroupUser.create({ ...userRow, roleGroupId: newRoleGroup.id }).catch((err) => {
              console.error(err)
              throw new Error('Users row write error')
            })
          }

          res.status(200).send(newRoleGroup)
        } catch (error) {
          return res.status(400).send({ message: error })
        }
      })
      .catch((err) => {
        console.error(err)
        res.status(400).send('Role group is not created')
      })
  },

  async update(req, res, next) {
    const existRoleGroup = await ObjectModel.findByPk(req.params.id)

    if (existRoleGroup) {
      const { settings, users, ...roleGroupData } = req.body

      if (roleGroupData.presentation) {
        delete roleGroupData.presentation
      }

      const t = await ObjectModel.sequelize.transaction()

      try {
        const updateRoleGroup = await existRoleGroup.update(roleGroupData, { transaction: t }).catch((error) => {
          throw error
        })

        await RoleGroupSetting.destroy({ where: { roleGroupId: req.params.id } }, { transaction: t }).catch((error) => {
          throw error
        })

        await RoleGroupUser.destroy({ where: { roleGroupId: req.params.id } }, { transaction: t }).catch((error) => {
          throw error
        })

        for (let settingRow of settings) {
          await RoleGroupSetting.create({ ...settingRow, roleGroupId: req.params.id }, { transaction: t }).catch((error) => {
            throw error
          })
        }

        for (let userRow of users) {
          await RoleGroupUser.create({ ...userRow, roleGroupId: req.params.id }, { transaction: t }).catch((error) => {
            throw error
          })
        }

        await t.commit()

        res.status(200).send(updateRoleGroup)
      } catch (error) {
        await t.rollback()
        console.error(error)
        res.status(400).send({ message: error })
      }
    } else {
      res.status(400).send({ message: 'Role group is not found' })
    }
  },

  async delete(req, res) {
    const existRoleGroup = await ObjectModel.findByPk(req.params.id)

    if (existRoleGroup) {
      RoleGroup.destroy({
        where: {
          id: req.params.id,
        },
        include: [
          { model: RoleGroupSetting, as: 'settings' },
          { model: RoleGroupUser, as: 'users' },
        ],
      }).catch((err) =>
        res.starus(400).send({
          message: 'błąd wewnętrzny',
        })
      )

      res.status(200).send({ message: 'OK' })
    } else {
      res.status(400).send({ message: 'Role group is not found' })
    }
  },

  async getCurrentUserRoles(req, res, next) {
    const resArray = []
    if (req.user) {
      if (req.user.fullRights !== true) {
        const currentUserId = req.user.id
        const roleGroupsUsersResult = await RoleGroupUser.findAll({
          where: { userId: currentUserId },
          attributes: ['roleGroupId'],
        })

        let roleGroupsArray = []
        roleGroupsUsersResult.forEach((el) => {
          roleGroupsArray.push(el.dataValues.roleGroupId)
        })

        const roleGroupSettingsResult = await RoleGroupSetting.findAll({
          where: { roleGroupId: roleGroupsArray },
        })

        roleGroupSettingsResult.forEach((el) => {
          if (!resArray.includes(el.dataValues.key)) {
            resArray.push(el.dataValues.key)
          }
        })

        res.status(200).send({
          userModules: resArray,
        })
      } else {
        // RoleGroupDefaultSettings.forEach((el) => {
        //   resArray.push(el.key)
        // })
        res.status(200).send({
          userModules: resArray,
        })
      }
    } else {
      res.status(400).send({
        userModules: resArray,
      })
    }
  },
}
