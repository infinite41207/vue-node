const httpStatus = require('http-status-codes')
const logger = require('@logging/logger')

module.exports = {
  async createItem(itemModel, itemParams) {
    try {
      delete itemParams.id

      const newItem = await itemModel.create(itemParams).catch((err) => {
        console.log(err)
        result = {
          httpStatus: httpStatus.StatusCodes.BAD_REQUEST,
          status: 'failed',
          errorDetails: httpStatus.getStatusText(httpStatus.StatusCodes.BAD_REQUEST),
        }
        return result
      })
      let responseObj = newItem
      result = { httpStatus: httpStatus.StatusCodes.OK, status: 'successful', responseData: responseObj }
      return result
    } catch (err) {
      logger.error('Error in newCatalogsItem Service', { meta: err })
      result = { httpStatus: httpStatus.StatusCodes.BAD_REQUEST, status: 'failed', errorDetails: err }
      return result
    }
  },

  async findAllItems(itemModel, filterParams = {}, includeArray = [], orderArray = []) {
    let result = {}
    try {
      const allItems = await itemModel.findAll({
        where: filterParams,
        include: includeArray,
        order: orderArray,
      })

      if (allItems) {
        result = { httpStatus: httpStatus.StatusCodes.OK, status: 'successful', responseData: allItems }
      } else {
        result = { httpStatus: httpStatus.StatusCodes.OK, status: 'failed', responseData: null }
      }
      return result
    } catch (err) {
      console.error(err)
      logger.error('Error in findAllItems Service', { meta: err })
      result = { httpStatus: httpStatus.StatusCodes.BAD_REQUEST, status: 'failed', errorDetails: err }
      return result
    }
  },

  async findItemById(itemModel, id) {
    try {
      let resItem = await itemModel.findByPk(id)
      result = resItem
        ? { httpStatus: httpStatus.StatusCodes.OK, status: 'successful', responseData: resItem }
        : {
            httpStatus: httpStatus.StatusCodes.NOT_FOUND,
            status: 'failed',
            errorDetails: httpStatus.getStatusText(httpStatus.StatusCodes.NOT_FOUND),
          }
      return result
    } catch (err) {
      logger.error('Error in findItemById Service', { meta: err })
      result = { httpStatus: httpStatus.StatusCodes.BAD_REQUEST, status: 'failed', errorDetails: err }
      return result
    }
  },

  async updateItem(itemModel, id, updateParams) {
    let updateItem
    try {
      const existItem = await itemModel.findByPk(id)
      if (existItem) {
        updateItem = await existItem.update(updateParams).catch((err) => {
          console.error(err)
          result = { httpStatus: httpStatus.StatusCodes.BAD_REQUEST, status: 'failed', errorDetails: err }
          return result
        })
      }

      result = updateItem
        ? { httpStatus: httpStatus.StatusCodes.OK, status: 'successful', responseData: updateItem }
        : {
            httpStatus: httpStatus.StatusCodes.BAD_REQUEST,
            status: 'failed',
            errorDetails: httpStatus.getStatusText(httpStatus.StatusCodes.BAD_REQUEST),
          }
      return result
    } catch (err) {
      logger.error('Error in updateItem Service', { meta: err })
      result = { httpStatus: httpStatus.StatusCodes.BAD_REQUEST, status: 'failed', errorDetails: err }
      return result
    }
  },

  async deleteItem(itemModel, id) {
    const existItem = await itemModel.findByPk(id)
    if (existItem) {
      existItem
        .destroy({
          where: {
            id: id,
          },
        })
        .catch((err) => {
          result = { httpStatus: httpStatus.StatusCodes.BAD_REQUEST, status: 'failed', errorDetails: err }
          return result
        })
      result = { httpStatus: httpStatus.StatusCodes.OK, status: 'successful', responseData: true }
      return result
    } else {
      result = { httpStatus: httpStatus.StatusCodes.BAD_REQUEST, status: 'failed' }
      return result
    }
  },
}
