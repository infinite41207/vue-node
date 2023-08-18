const { Sequelize } = require('sequelize')
const RoleGroupSetting = require('@catalogs/roleGroups/models/roleGroupSetting')
const RoleGroupUser = require('@catalogs/roleGroups/models/roleGroupUser')
const UserRole = require('@catalogs/userRoles/models')
const AccessRestriction = require('@registers/accessRestrictions/models')
const Department = require('@catalogs/departments/models')
const commonService = require('./commonService')
const { Op } = require('sequelize')

module.exports = {
  async getUserAccessRoles(userId, canRead = false, canModify = false) {
    return await RoleGroupUser.findAll({ where: { userId } })
      .then(async (result) => {
        const roleGroupId = result.map((el) => {
          return el.roleGroupId
        })

        const filter = { roleGroupId }

        if (canModify === true) {
          filter.canModify = true
        } else if (canRead === true) {
          filter.canRead = true
        }

        return await RoleGroupSetting.findAll({
          where: filter,
        })
          .then((settResult) => {
            const accessRoles = []

            for (const role of settResult) {
              const i = accessRoles.findIndex((el) => el.id === role.id)

              if (i > -1) {
                if (role.canRead !== accessRoles[i].canRead && role.canRead === true) {
                  accessRoles[i].canRead = role.canRead
                }

                if (role.canModify !== accessRoles[i].canModify && role.canModify === true) {
                  accessRoles[i].canModify = role.canModify
                }
              } else {
                accessRoles.push({ userRoleId: role.userRoleId, canRead: role.canRead, canModify: role.canModify })
              }
            }

            return accessRoles
          })
          .catch((error) => {
            throw error
          })
      })
      .catch((error) => {
        throw error
      })
  },

  async getUserAccessRoleId(userId, canRead = false, canModify = false) {
    return await RoleGroupUser.findAll({ where: { userId } })
      .then(async (result) => {
        const roleGroupId = result.map((el) => {
          return el.roleGroupId
        })

        const filter = { roleGroupId }

        if (canModify === true) {
          filter.canModify = true
        } else if (canRead === true) {
          filter.canRead = true
        }

        return await RoleGroupSetting.findAll({ where: filter })
          .then((settResult) => {
            result = settResult.map((el) => {
              return el.userRoleId
            })

            return result
          })
          .catch((error) => {
            throw error
          })
      })
      .catch((error) => {
        throw error
      })
  },

  async getUserRoleByKey(roleKey) {
    return await UserRole.findOne({ where: { key: roleKey } })
      .then(async (result) => {
        return result
      })
      .catch((error) => {
        throw error
      })
  },

  async checkUserAccess(userId, roleKey, canRead = false, canModify = false) {
    const userRole = await this.getUserRoleByKey(roleKey)

    if (!userRole) {
      return new Error(`Role with key ${roleKey} does not exist`)
    }

    return await RoleGroupUser.findAll({ where: { userId } })
      .then(async (result) => {
        const roleGroupId = result.map((el) => {
          return el.roleGroupId
        })

        const filter = { roleGroupId, userRoleId: userRole.id }

        if (canModify === true) {
          filter.canModify = true
        } else if (canRead === true) {
          filter.canRead = true
        }

        return await RoleGroupSetting.findAll({
          where: filter,
        })
          .then((settResult) => {
            if (settResult && settResult.length > 0) {
              return true
            }
            return false
          })
          .catch((error) => {
            throw error
          })
      })
      .catch((error) => {
        throw error
      })
  },

  async accessRestrictions(req, object) {
    const restrictions = {
      use: false,
      users: [],
    }

    const existRestrictions = await AccessRestriction.findOne({ where: { objectType: object.name } })

    if (existRestrictions) {
      if (existRestrictions.useRestriction === true || existRestrictions.useDepartmentRestriction === true) {
        restrictions.use = true
        restrictions.users.push(req.user.id)

        if (existRestrictions.useDepartmentRestriction === true) {
          const include = commonService.prepareIncludes(Department, { objectDetails: true })

          const departments = await Department.findAll({ where: { [Op.or]: [{ leaderId: req.user.id }, { deputyId: req.user.id }] }, include })

          if (departments) {
            for (const department of departments) {
              for (const row of department.employees) {
                restrictions.users.push(row.employeeId)
              }
            }
          }
        }
      }
    }

    return restrictions
  },
}
