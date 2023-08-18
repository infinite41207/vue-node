const express = require('express')

const itemController = require('../controllers')
const router = express.Router()

router.get('/calendars', itemController.getAllItems)
router.post('/calendars', itemController.createItem)
router.put('/calendars', itemController.updateItem)
router.delete('/calendars', itemController.deleteItem)

module.exports = router
