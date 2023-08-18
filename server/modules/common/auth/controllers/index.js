const User = require('@catalogs/users/models')
const securityService = require('@services/securityService')
const httpStatus = require('http-status-codes')
const logger = require('@logging/logger')
const jwt = require('jsonwebtoken')

module.exports = {
  async login(req, res, next) {
    // If this part gets executed, it means authentication was successful
    // Regenerating a new session ID after the user is authenticated
    let temp = req.session.passport

    req.session.regenerate((err) => {
      req.session.passport = temp
      req.session.save((err) => {
        const access_token = jwt.sign({ id: req.user.id }, process.env.PRIVATE_KEY_FOR_JWT, {
          expiresIn: '360h',
        })

        res.status(httpStatus.StatusCodes.OK).send({
          result: access_token,
          token: access_token,
          email: req.user.email,
          login: req.user.login,
          fullRights: req.user.fullRights,
          useCustomerAccess: req.user.useCustomerAccess,
          name: req.user.name,
          language: req.user.language,
        })
      })
    })
  },

  async session(req, res, next) {
    const result = {
      isAuthenticated: false,
    }

    if (!req.session.passport) {
      res.status(httpStatus.StatusCodes.UNAUTHORIZED).send({ result: result, message: 'Authentication failed' })
      return
    }

    if (!req.session.passport.user) {
      res.status(httpStatus.StatusCodes.UNAUTHORIZED).send({ result: result, message: 'Authentication failed' })
      return
    }

    const user = await User.findOne({
      where: {
        id: req.session.passport.user,
      },
    }).catch((err) => {
      res.status(httpStatus.StatusCodes.UNAUTHORIZED).send({ result: result, message: 'Authentication failed' })
    })

    if (user) {
      result.isAuthenticated = true
      result.id = user.id
      result.name = user.name
      result.login = user.login
      result.fullRights = user.fullRights
      result.useCustomerAccess = user.useCustomerAccess
      result.externalUser = user.externalUser
      result.email = user.email
      result.language = user.language

      res.status(httpStatus.StatusCodes.OK).send({ result: result, message: 'OK' })
    } else {
      res.status(httpStatus.StatusCodes.UNAUTHORIZED).send({ result: result, message: 'Authentication failed' })
    }
  },

  async logout(req, res, next) {
    req.logout(function (err) {
      if (err) {
        return next(err)
      }
    })

    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return res.status(httpStatus.StatusCodes).send('server error - could not clear out session info completely')
        }
        return res.status(httpStatus.StatusCodes.OK).send('logged out successfully')
      })
    } else {
      if (req.isUnauthenticated()) {
        return res.status(httpStatus.StatusCodes.OK).send('logged out successfully')
      } else {
        return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send('server error - could not log out')
      }
    }
  },

  async register(req, res, next) {
    let response
    try {
      response = await securityService.register(req.body)
      return res.status(response.httpStatus).send(response.result)
    } catch (error) {
      logger.error('Error in register Controller', { meta: error })
      return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ message: error })
    }
  },

  async confirmEmailAddress(req, res, next) {
    let response
    try {
      response = await securityService.confirmEmailAddress(req.params.token)
      return res.status(response.httpStatus).send(response.result)
    } catch (error) {
      logger.error('Error in confirmEmailAddress Controller', { meta: error })
      return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ message: error })
    }
  },

  async resendEmailAddressConfirmationLink(req, res, next) {
    let response
    try {
      response = await securityService.resendEmailAddressConfirmationLink(req.query.email)
      return res.status(response.httpStatus).send(response.result)
    } catch (error) {
      logger.error('Error in resendEmailAddressConfirmationLink Controller', { meta: error })
      return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ message: error })
    }
  },

  async forgotPassword(req, res, next) {
    let response
    try {
      response = await securityService.forgotPassword(req.body.email)
      return res.status(response.httpStatus).send(response.result)
    } catch (error) {
      logger.error('Error in forgotPassword Controller', { meta: error })
      return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ message: error })
    }
  },

  async validatePasswordResetToken(req, res, next) {
    let response
    try {
      response = await securityService.isPasswordResetTokenValid(req.params.token)
      return res.status(response.httpStatus).send(response.result)
    } catch (error) {
      logger.error('Error in validatePasswordResetToken Controller', { meta: error })
      return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ message: error })
    }
  },

  async resetPassword(req, res, next) {
    let response
    try {
      response = await securityService.resetPassword(req.body.token, req.body.newPassword)
      return res.status(response.httpStatus).send(response.result)
    } catch (error) {
      logger.error('Error in resetPassword Controller', { meta: error })
      return res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ message: error })
    }
  },
}
