const express = require('express')
const router = express.Router() 

const controllers = require('../controllers')
const accessRights = require('@middleware/accessRights')

router.get('/role_group', accessRights.canRead('role_groups'), controllers.findAll)
router.get('/role_group/:id', accessRights.canRead('role_groups'), controllers.findById)
router.post('/role_group', accessRights.canModify('role_groups'), controllers.create)
router.put('/role_group/:id', accessRights.canModify('role_groups'), controllers.update)
router.delete('/role_group/:id', accessRights.canModify('role_groups'), controllers.delete)

module.exports = router
