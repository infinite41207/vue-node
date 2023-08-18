const express = require('express')

const itemController = require('../controllers')
const router = express.Router()
const accessRights = require('@middleware/accessRights')

const path = 'email_templates'

router.get(`/${path}`, accessRights.canRead(path), itemController.findAll)
router.get(`/${path}/:id`, accessRights.canRead(path), itemController.findById)
router.post(`/${path}`, accessRights.canModify(path), itemController.create)
router.put(`/${path}/:id`, accessRights.canModify(path), itemController.update)
router.delete(`/${path}/:id`, accessRights.canModify(path), itemController.delete)

module.exports = router
