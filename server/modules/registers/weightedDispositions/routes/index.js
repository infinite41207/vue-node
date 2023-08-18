const express = require('express')
const router = express.Router()

const controllers = require('../controllers')

router.get('/weighted_dispositions', controllers.findAll)
router.get('/weighted_dispositions/:id', controllers.findById)
router.get('/weighted_find_dispositions', controllers.findByDispositionId)
router.post('/weighted_dispositions', controllers.create)
router.put('/weighted_dispositions/:id', controllers.update)
router.delete('/weighted_dispositions/:id', controllers.delete)

module.exports = router
