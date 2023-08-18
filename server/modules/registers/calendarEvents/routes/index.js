const express = require('express');

const itemController = require('../controllers');
const router = express.Router();

router.post('/calendar_events', itemController.createItem);
router.get('/calendar_events', itemController.getAllItems);
router.put('/calendar_events', itemController.updateItem);
router.delete('/calendar_events', itemController.deleteItem);

module.exports = router;