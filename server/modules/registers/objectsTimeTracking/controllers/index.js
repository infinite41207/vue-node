const Object = require('../models/index')
const InteractionsModel = require('@documents/interactions/models/index')
const commonService = require('@services/commonService')
const logger = require('@logging/logger')
const _ = require('lodash')

module.exports = {

  async findAll(req, res, next) {
    commonService.findAllItems(req, res, next, Object)
  },

  async findCurrentObjects(req, res, next) {
   
    const filter = {
      userId: req.user.id,
      endDate: null
    };

    try {
      let items;    
      items = await Object.findAll({
        where: filter,
      })
      for (const item of items) {
        if (item.objectType === 'interaction') {
        
          const currentObject = await InteractionsModel.findOne({
            where: { id: item.objectId }
          }).catch((err) => {
            console.error(err)
          })
          if (currentObject) {
            item.dataValues.objectData = {...currentObject.dataValues};
          }
        }
      }    
      //console.log(items);  
      if (items) {
        items = JSON.stringify(items)
        items = JSON.parse(items)
        res.status(200).send(items)
      } else {
        logger.error(`Error in ${Object.options.name.plural} findAll controller`, { meta: 'Items not find' })
        res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Items not find' })
      }
    } catch (error) {
      logger.error(`Error in ${Object .options.name.plural} findAll controller`, { meta: error })
      res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send({ message: error })
    }

  },

  async findById(req, res, next) {
    commonService.findItem(req, res, next, Object)
  },

  async create(req, res, next) {
    
    const createParams = {
      body: {
        userId: req.user.id,
        objectId: req.body.object.id,
        objectType: req.body.objectType,
        startDate: new Date(),
      },
    }

    const existNullItems = await Object.findAll({
      where: {
        userId: req.user.id,
        objectId: req.body.object.id,
        objectType: req.body.objectType,
        endDate: null,
      },
    })    

    if (existNullItems.length) {
      res.status(400).send({ message: 'Time tracking is already started' });
      return;
    } else {
      commonService.createItem(createParams, res, next, Object)
    }
  },

  async update(req, res, next) {
    commonService.updateItem(req, res, next, Object)
  },

  async delete(req, res, next) {
    commonService.deleteItem(req, res, next, Object)
  },

  async changeDeletionMark(req, res, next) {
    commonService.changeItemDelMark(req, res, next, Object)
  },
}
