const express = require('express')
const router = express.Router()

const controllers = require('../controllers')
const accessRights = require('@middleware/accessRights')

const path = 'email_accounts'

router.get(`/${path}`, accessRights.canRead(path), controllers.findAll)
router.get(`/${path}/:id`, accessRights.canRead(path), controllers.findById)
router.post(`/${path}`, accessRights.canModify(path), controllers.create)
router.put(`/${path}/:id`, accessRights.canModify(path), controllers.update)
router.delete(`/${path}/:id`, accessRights.canModify(path), controllers.delete)
router.post(`/${path}/change_deletion_mark`, accessRights.canModify(path), controllers.changeDeletionMark)

router.get('/email_account_signature/:id', accessRights.canRead(path), controllers.getSignature)

module.exports = router
