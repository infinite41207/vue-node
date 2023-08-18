const express = require('express')
const router = express.Router()

const controller = require('../controllers')
const accessRights = require('@middleware/accessRights')

router.get('/user_setting_item', accessRights.canRead('user_setting_items'), controller.findAll)
router.get('/user_setting_item/:id', accessRights.canRead('user_setting_items'), controller.findById)
router.post('/user_setting_item', accessRights.canModify('user_setting_items'), controller.create)
router.put('/user_setting_item/:id', accessRights.canModify('user_setting_items'), controller.update)

module.exports = router
