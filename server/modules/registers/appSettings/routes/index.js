const express = require('express')
const router = express.Router()

const controllerUserSettingItem = require('../controllers/userSettingItem')
const controllerUserSetting = require('../controllers/userSetting')

router.get('/app_setting_items', controllerUserSettingItem.findAll)
router.get('/app_setting_item/:id', controllerUserSettingItem.findById)
router.post('/app_setting_item', controllerUserSettingItem.create)
router.put('/app_setting_item', controllerUserSettingItem.update)

router.get('/app_settings', controllerUserSetting.findAll)
router.post('/app_settings', controllerUserSetting.write)
router.get('/app_setting', controllerUserSetting.findByKey)
module.exports = router
