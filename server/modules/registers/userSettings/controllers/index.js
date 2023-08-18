const UserSetting = require('../models')
const UserSettingItem = require('@catalogs/userSettingItems/models')
const uuidlib = require('uuid')

module.exports = {
  async findAll(req, res, next) {
    const filter = JSON.parse(req.query.filter || '{}')

    const include = [
      {
        model: UserSettingItem,
        as: 'userSettingItem',
        attributes: ['id', 'key'],
      },
    ]

    await UserSetting.findAll({ where: filter, include, order: ['id'] })
      .then((result) => {
        res.status(200).send(result)
      })
      .catch((error) => {
        console.error(error)
        res.status(400).send({ message: 'Bad request' })
      })
  },

  async write(req, res, next) {
    const valueUserId = req.body.userId

    await UserSetting.destroy({ where: { userId: valueUserId } })

    for (let newRow of req.body.userSettings) {
      newRow.userId = valueUserId
      newRow.userSettingItemId = newRow.id
      delete newRow.id
      await UserSetting.create(newRow)
    }
  },

  async findByKey(req, res, next) {
    let filter = { key: req.query.userSettingItemKey }
    if (!req.query.userId) {
      res.status(400).send({ message: 'User is not authorized.' })
      return
    }

    await UserSettingItem.findOne({ where: filter })
      .then(async (settingItem) => {
        if (!settingItem) {
          res.status(400).send({ message: 'User setting is not found.' })
          return
        }

        filter = {
          userId: req.query.userId,
          userSettingItemId: settingItem.id,
        }
        await UserSetting.findAll({ where: filter })
          .then((response) => {
            if (response.length === 0) {
              const result = getDefaultValue(settingItem)
              res.status(200).send(result)
            } else {
              let returnValue

              if (response[0].valueType === 'number') {
                returnValue = response[0].valueNumber
              } else if (response[0].valueType === 'string') {
                returnValue = response[0].valueString
              } else if (response[0].valueType === 'date') {
                returnValue = response[0].valueDate
              } else if (response[0].valueType === 'boolean') {
                returnValue = response[0].valueBoolean
              } else if (response[0].valueType === 'ref') {
                returnValue = response[0].valueRef
              }

              res.status(200).send(returnValue)
            }
          })
          .catch((error) => {
            console.error(error)
            res.status(400).send({ message: error })
          })
      })
      .catch((error) => {
        console.error(error)
        res.status(400).send({ message: error })
      })
  },

  async createItem(req, res, next) {
    let response

    try {
      response = await catalogService.createItem(itemModel, req.body)
      return res.status(response.httpStatus).send(response)
    } catch (error) {
      logger.error('Error in createItem Controller', { meta: error })
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: error })
    }
  },

  async update(req, res, next) {
    await UserSetting.findAll({
      where: {
        userSettingItemId: req.params.id,
        userId: req.body.userId,
      },
    })
      .then(async (response) => {
        if (response.length > 0) {
          await UserSetting.update(req.body, {
            where: {
              id: response[0].id,
            },
          })
            .then((updated) => {
              res.status(200).send(updated)
            })
            .catch((err) => {
              console.error(err)
              res.status(400).send({ message: err })
            })
        } else {
          const object = req.body
          object.userSettingItemId = object.id
          object.id = uuidlib.v4()

          await UserSetting.create(object)
            .then((created) => {
              res.status(200).send(created)
            })
            .catch((err) => {
              console.error(err)
              res.status(400).send({ message: err })
            })
        }
      })
      .catch((err) => {
        console.error(err)
        res.status(400).send({ message: err })
      })
  },
}

function getDefaultValue(userSetting) {
  let defaultValue

  if (userSetting.valueType === 'number') {
    defaultValue = 0
  } else if (userSetting.valueType === 'string') {
    defaultValue = ''
  } else if (userSetting.valueType === 'date') {
    defaultValue = null
  } else if (userSetting.valueType === 'boolean') {
    defaultValue = false
  } else if (userSetting.valueType === 'ref') {
    defaultValue = null
  }

  return defaultValue
}
