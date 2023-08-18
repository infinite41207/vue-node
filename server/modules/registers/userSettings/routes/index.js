const express = require('express')
const router = express.Router()

const controller = require('../controllers')

router.get('/user_settings', controller.findAll)
router.get('/user_setting', controller.findByKey)
router.post('/user_settings', controller.write)
router.put('/user_settings/:id', controller.update)

module.exports = router
