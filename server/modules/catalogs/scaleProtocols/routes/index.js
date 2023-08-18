const express = require('express')
const router = express.Router()

const controllers = require('../controllers')
const accessRights = require('@middleware/accessRights')

router.get('/scale_protocol', accessRights.canRead('scale_protocols'), controllers.findAll)
router.get('/scale_protocol/:id', accessRights.canRead('scale_protocols'), controllers.findById)
router.post('/scale_protocol', accessRights.canModify('scale_protocols'), controllers.create)
router.put('/scale_protocol/:id', accessRights.canModify('scale_protocols'), controllers.update)
router.delete('/scale_protocol/:id', accessRights.canModify('scale_protocols'), controllers.delete)

module.exports = router
