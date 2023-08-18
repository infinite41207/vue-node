const express = require('express')
const router = express.Router()

const controller = require('../controllers')

router.get('/report_variant', controller.findAll)
router.get('/report_variant/:id', controller.findById)
router.post('/report_variant', controller.create)
router.put('/report_variant/:id', controller.update)
router.delete('/report_variant/:id', controller.delete)

module.exports = router
