const userAccessService = require('@services/userAccessService')
const httpStatus = require('http-status-codes')
const logger = require('@logging/logger')

module.exports = {
  canRead: (role) => {
    return async (req, res, next) => {
      
      if (!req.user) {
        const message = 'Error in accessRight.canRead. User not authenticated';
        logger.error(message)
        return res.status(httpStatus.StatusCodes.FORBIDDEN).send({message})  
      }
      
      if (req.user.fullRights === true) {
        next()
        return
      }

      const userId = req.user?.id

      if (userId) {
        await userAccessService
          .checkUserAccess(userId, role, true)
          .then((result) => {
            if (result === true) {
              next()
            } else {
              const message = `User ${req.user?.name} not have access to read. Role ${role}`
              logger.error('Error in accessRight.canRead', { meta: message })
              res.status(httpStatus.StatusCodes.FORBIDDEN).send({ message: message })
            }
          })
          .catch((error) => {
            logger.error('Error in accessRight.canRead', { meta: error })
            res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ message: error })
          })
      } else {
        res.status(httpStatus.StatusCodes.UNAUTHORIZED).send({ message: 'User not authorized' })
      }
    }
  },
  canModify: (role) => {
    return async (req, res, next) => {
      if (req.user?.fullRights === true) {
        next()
        return
      }

      const userId = req.user?.id

      if (userId) {
        await userAccessService
          .checkUserAccess(userId, role, true, true)
          .then((result) => {
            if (result === true) {
              next()
            } else {
              const message = `User ${req.user?.name} not have access to modify. Role ${role}`
              logger.error('Error in accessRight.canModify', { meta: message })
              res.status(httpStatus.StatusCodes.FORBIDDEN).send({ message: message })
            }
          })
          .catch((error) => {
            logger.error('Error in accessRight.canModify', { meta: error })
            res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ message: error })
          })
      } else {
        res.status(httpStatus.StatusCodes.UNAUTHORIZED).send({ message: 'User not authorized' })
      }
    }
  },
}
