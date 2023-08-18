const express = require('express')

const appController = require('../controllers')

const router = express.Router()

router.get('/app/objects', appController.getObjects)
router.get('/app/object_meta', appController.getObjectMetadata)

module.exports = router
