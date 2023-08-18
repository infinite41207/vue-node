const express = require('express')
const router = express.Router()
const fileUpload = require('@middleware/fileUpload')

const passportAuth = require('@common/auth/passportAuth')
const controllers = require('../controllers')
const accessRights = require('@middleware/accessRights')

router.use(passportAuth.isAuthenticated)

router.get('/sales_order', accessRights.canRead('sales_orders'), controllers.findAll)
router.get('/sales_order/:id', accessRights.canRead('sales_orders'), controllers.findById)
router.post('/sales_order', accessRights.canModify('sales_orders'), controllers.create)
router.put('/sales_order/:id', accessRights.canModify('sales_orders'), controllers.update)
router.delete('/sales_order/:id', accessRights.canModify('sales_orders'), controllers.delete)

router.post('/sales_order/file', accessRights.canModify('sales_orders'), fileUpload.array('files'), controllers.attachFiles)
router.post('/sales_order/object_file', accessRights.canModify('sales_orders'), controllers.getFiles)
router.get('/sales_order/file/:id', accessRights.canRead('sales_orders'), controllers.getFile)
router.delete('/sales_order/file/:id', accessRights.canModify('sales_orders'), controllers.deleteFile)

router.post('/sales_order/change_deletion_mark', accessRights.canModify('sales_orders'), controllers.changeDeletionMark)
router.post('/sales_order/check_double', accessRights.canModify('sales_orders'), controllers.checkDouble)
router.post('/sales_order/get_double_data', accessRights.canModify('sales_orders'), controllers.getDoubleData)
router.get('/sales_order/subordination/:id', controllers.getSubordination)

module.exports = router
