const httpStatus = require('http-status-codes');
const logger = require('@logging/logger');

module.exports = {
  async createItem(itemModel, itemParams) {
    if (itemParams.id) {
      delete itemParams.id;
    }
    const result = await itemModel.create(itemParams)
      .then(() => {
        let responseObj = true;
        const result = { httpStatus: httpStatus.StatusCodes.OK, status: 'successful', responseData: responseObj };

        return result;
      })
      .catch((err) => {
        const result = {
          httpStatus: httpStatus.StatusCodes.BAD_REQUEST,
          status: 'failed',
          errorDetails: httpStatus.getStatusText(httpStatus.StatusCodes.BAD_REQUEST),
          responseData: err,
        };

        return result;
      });

    return result;
  },

  async createItemReturn(itemModel, itemParams) {
    if (itemParams.id) {
      delete itemParams.id;
    }
    const result = await itemModel.create(itemParams)
      .then((res) => {
        let responseObj = res.dataValues;
        const result = { httpStatus: httpStatus.StatusCodes.OK, status: 'successful', responseData: responseObj };

        return result;
      })
      .catch((err) => {
        const result = {
          httpStatus: httpStatus.StatusCodes.BAD_REQUEST,
          status: 'failed',
          errorDetails: httpStatus.getStatusText(httpStatus.StatusCodes.BAD_REQUEST),
          responseData: err,
        };

        return result;
      });

    return result;
  },

  async findAllItems(itemModel, filterParams = {}, includeArray = [], orderArray = [], pagination = {}) {
    let result = {};
    try {
      let allItems;
      if (pagination.page) {
        let limit = 10;
        let offset = 0 + (pagination.page - 1) * limit;
        allItems = await itemModel.findAndCountAll({
          where: filterParams,
          offset: offset,
          limit: limit,
          include: includeArray,
          order: orderArray,
        });
      } else {
        allItems = await itemModel.findAll({
          where: filterParams,
          include: includeArray,
          order: orderArray,
        });
      }

      if (allItems) {
        result = { httpStatus: httpStatus.StatusCodes.OK, status: 'successful', responseData: allItems };
      } else {
        result = { httpStatus: httpStatus.StatusCodes.OK, status: 'failed', responseData: null };
      }

      return result;
    } catch (err) {
      logger.error('Error in Catalog service findAllItems method', { meta: err });
      result = { httpStatus: httpStatus.StatusCodes.BAD_REQUEST, status: 'failed', errorDetails: err };
      return result;
    }
  },

  async findItemById(itemModel, id) {
    try {
      let resItem = await itemModel.findByPk(id);
      result = resItem
        ? { httpStatus: httpStatus.StatusCodes.OK, status: 'successful', responseData: resItem }
        : {
          httpStatus: httpStatus.StatusCodes.NOT_FOUND,
          status: 'failed',
          errorDetails: httpStatus.getStatusText(httpStatus.StatusCodes.NOT_FOUND),
        };
      return result;
    } catch (err) {
      logger.error('Error in findItemById Service', { meta: err });
      result = { httpStatus: httpStatus.StatusCodes.BAD_REQUEST, status: 'failed', errorDetails: err };
      return result;
    }
  },

  async updateItem(itemModel, id, updateParams) {
    let updateItem;
    const existItem = await itemModel.findByPk(id);
    if (existItem) {
      updateItem = await existItem.update(updateParams).catch((err) => {
        result = { httpStatus: httpStatus.StatusCodes.BAD_REQUEST, status: 'failed', errorDetails: err };
        return result;
      });
    }

    result = updateItem
      ? { httpStatus: httpStatus.StatusCodes.OK, status: 'successful', responseData: updateItem }
      : {
        httpStatus: httpStatus.StatusCodes.BAD_REQUEST,
        status: 'failed',
        errorDetails: httpStatus.getStatusText(httpStatus.StatusCodes.BAD_REQUEST),
      };
    return result;
  },

  async deleteItem(itemModel, id) {
    const existItem = await itemModel.findByPk(id);
    if (existItem) {
      existItem
        .destroy({
          where: {
            id: id,
          },
        })
        .catch((err) => {
          result = { httpStatus: httpStatus.StatusCodes.BAD_REQUEST, status: 'failed', errorDetails: err };
          return result;
        });
      result = { httpStatus: httpStatus.StatusCodes.OK, status: 'successful', responseData: true };
      return result;
    } else {
      result = { httpStatus: httpStatus.StatusCodes.BAD_REQUEST, status: 'failed' };
      return result;
    }
  },
};
