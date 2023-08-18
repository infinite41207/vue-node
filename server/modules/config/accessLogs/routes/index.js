const express = require('express')
const router = express.Router()

const controllerAccessLog = require('../controllers/index')
const accessRights = require('@middleware/accessRights')

router.get('/access_log' , accessRights.canRead('access_logs'), controllerAccessLog.getAllFiles)
router.get('/access_log/:name' , accessRights.canRead('access_logs'), controllerAccessLog.getFileInfo)

module.exports = router