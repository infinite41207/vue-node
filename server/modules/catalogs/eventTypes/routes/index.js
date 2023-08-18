const express = require('express')

const itemController = require('../controllers')
const router = express.Router()
const accessRights = require('@middleware/accessRights')

const path = 'event_types'

router.post(`/${path}`, accessRights.canRead(path), itemController.create)
router.get(`/${path}`, accessRights.canRead(path), itemController.findAll)
router.get(`/${path}/:id`, accessRights.canRead(path), itemController.findById)
router.put(`/${path}/:id`, accessRights.canRead(path), itemController.update)
router.delete(`/${path}/:id`, accessRights.canRead(path), itemController.delete)

module.exports = router
