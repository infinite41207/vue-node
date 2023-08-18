const express = require('express')
const router = express.Router()
const accessRights = require('@middleware/accessRights')

const controllers = require('../controllers')

const path = 'departments'

router.get(`/${path}`, accessRights.canRead(path), controllers.findAll)
router.get(`/${path}/:id`, accessRights.canRead(path), controllers.findById)
router.post(`/${path}`, accessRights.canModify(path), controllers.create)
router.put(`/${path}/:id`, accessRights.canModify(path), controllers.update)
router.delete(`/${path}/:id`, accessRights.canModify(path), controllers.delete)
router.post(`/${path}/change_deletion_mark`, accessRights.canModify(path), controllers.changeDeletionMark)

module.exports = router
