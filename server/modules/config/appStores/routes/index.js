const express = require('express')
const router = express.Router()

const controllers = require('../controllers')

router.get('/app_store', controllers.findAll)
router.get('/app_store/:id', controllers.findById)
router.post('/app_store', controllers.create)
router.put('/app_store/:id', controllers.update)
router.delete('/app_store/:id', controllers.delete)

module.exports = router
