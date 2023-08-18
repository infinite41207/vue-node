const express = require('express')
const router = express.Router()

const accessRights = require('@middleware/accessRights')
const controllers = require('../controllers')

router.get('/delivery_order', accessRights.canRead('delivery_orders'), controllers.findAll)
router.get('/delivery_order/:id', accessRights.canRead('delivery_orders'), controllers.findById)
router.post('/delivery_order', accessRights.canModify('delivery_orders'), controllers.create)
router.put('/delivery_order/:id', accessRights.canModify('delivery_orders'), controllers.update)
router.delete('/delivery_order/:id', accessRights.canModify('delivery_orders'), controllers.delete)
router.post('/delivery_order/change_deletion_mark', accessRights.canModify('delivery_orders'), controllers.changeDeletionMark)
router.get('/delivery_order/subordination/:id', accessRights.canRead('delivery_orders'), controllers.getSubordination)

module.exports = router
