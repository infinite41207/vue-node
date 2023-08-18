const cryptoGen = require('@common/auth/cryptoGen')
const securityService = require('./securityService')
const httpStatus = require('http-status-codes')
const logger = require('@logging/logger')

const User = require('@catalogs/users/models')
const UserCustomer = require('@catalogs/users/models/userCustomer')
const Customer = require('@catalogs/counterparties/models')

module.exports = {
  async create(userObj) {
    try {
      let userInfo = {
        email: userObj.email,
        password: cryptoGen.createPasswordHash(userObj.password),
        name: userObj.name,
        login: userObj.login,
        isActive: userObj.isActive,
        useCustomerAccess: userObj.useCustomerAccess,
        externalUser: userObj.externalUser,
        fullRights: userObj.fullRights,
        isConstructor: userObj.isConstructor,
        accessFiles: userObj.accessFiles,
        emailConfirmationToken: await cryptoGen.generateRandomToken(),
        referralToken: await cryptoGen.generateRandomToken(),
      }

      return await User.create(userInfo)
        .then(async (newUser) => {
          // If we have gotten here, the request must be successful, so respond accordingly
          logger.info('New user created', { meta: newUser.login })

          for (let customerRow of userObj.customers) {
            await UserCustomer.create({ ...customerRow, userId: newUser.id }).catch((error) => {
              console.error(error)
              return { httpStatus: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR, result: { message: error } }
            })
          }

          securityService.emailConfirmationInstructions(newUser.email, newUser.name, newUser.emailConfirmationToken)

          let responseData = { email: newUser.email, login: newUser.login, name: newUser.name }
          return { httpStatus: httpStatus.StatusCodes.OK, result: responseData }
        })
        .catch((error) => {
          return {
            httpStatus: httpStatus.StatusCodes.BAD_REQUEST,
            result: { message: error },
          }
        })
    } catch (error) {
      logger.error('Error in createUser Service', { meta: error })
      return { httpStatus: httpStatus.StatusCodes.BAD_REQUEST, result: { message: error } }
    }
  },

  async getAll() {
    let result = {}
    try {
      const users = await User.findAll({ order: ['name'] })
      if (users) {
        users.forEach((user) => {
          delete user.dataValues.password
          delete user.dataValues.emailConfirmationToken
          delete user.dataValues.passwordResetExpires
          delete user.dataValues.passwordResetToken
          delete user.dataValues.referralToken
        })
        result = { httpStatus: httpStatus.StatusCodes.OK, result: users }
      } else {
        result = { httpStatus: httpStatus.StatusCodes.OK, resilt: [] }
      }
      return result
    } catch (error) {
      logger.error('Error in getAllAdmins Service', { meta: error })
      return { httpStatus: httpStatus.StatusCodes.BAD_REQUEST, result: { message: error } }
    }
  },

  async getDetails(id) {
    let result = {}

    try {
      let user = await User.findByPk(id, {
        include: [
          {
            model: UserCustomer,
            as: 'customers',
            include: [{ model: Customer, as: 'customer', attributes: ['abbreviation', 'name', 'nip', 'email'] }],
          },
        ],
      })
      if (user) {
        delete user.dataValues.password
        delete user.dataValues.emailConfirmationToken
        delete user.dataValues.passwordResetExpires
        delete user.dataValues.passwordResetToken
        delete user.dataValues.referralToken
      }
      result = user ? { httpStatus: httpStatus.StatusCodes.OK, result: user } : { httpStatus: httpStatus.StatusCodes.NOT_FOUND, result: { message: 'User not found!' } }

      return result
    } catch (error) {
      logger.error('Error in getUserDetails Service', { meta: error })
      result = { httpStatus: httpStatus.StatusCodes.BAD_REQUEST, result: { message: error } }
      return result
    }
  },

  async update(id, userObj) {
    let result = {}
    try {
      const existUser = await User.findByPk(id)
      let updateUser
      if (existUser) {
        if (userObj.password) {
          userObj.password = cryptoGen.createPasswordHash(userObj.password)
        } else {
          delete userObj.password
        }

        updateUser = await existUser.update(userObj).catch((error) => {
          logger.error('Error in updateUser Service', { meta: error })
          return { httpStatus: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR, result: { message: error } }
        })

        await UserCustomer.destroy({ where: { userId: id } }).catch((error) => {
          logger.error('Error in updateUser Service', { meta: error })
          return { httpStatus: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR, result: { message: error } }
        })

        for (let customerRow of userObj.customers) {
          await UserCustomer.create({ ...customerRow, userId: id }).catch((error) => {
            logger.error('Error in updateUser Service', { meta: error })
            return { httpStatus: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR, result: { message: error } }
          })
        }
      }

      return updateUser
        ? { httpStatus: httpStatus.StatusCodes.OK, result: updateUser }
        : { httpStatus: httpStatus.StatusCodes.BAD_REQUEST, result: { message: httpStatus.getStatusText(httpStatus.StatusCodes.BAD_REQUEST) } }
    } catch (error) {
      logger.error('Error in updateUser Service', { meta: error })
      return { httpStatus: httpStatus.StatusCodes.BAD_REQUEST, result: { message: error } }
    }
  },

  async delete(id) {
    const existUser = await User.findByPk(id)
    if (existUser) {
      User.destroy({
        where: {
          id: id,
        },
        include: { model: UserCustomer, as: 'customers' },
      }).catch((error) => {
        return { httpStatus: httpStatus.StatusCodes.BAD_REQUEST, result: { message: error } }
      })

      return { httpStatus: httpStatus.StatusCodes.OK, result: true }
    } else {
      return { httpStatus: httpStatus.StatusCodes.NOT_FOUND, result: { mesage: httpStatus.getStatusText(httpStatus.StatusCodes.NOT_FOUND) } }
    }
  },
}
