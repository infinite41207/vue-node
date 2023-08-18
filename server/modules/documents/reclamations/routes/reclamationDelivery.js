const express = require('express');

const itemController = require('../controllers/reclamationDelivery');
const router = express.Router();

router.post('/reclamationdelivery', itemController.createItem);
router.get('/reclamationdeliveries', itemController.getAllItems);
router.get('/reclamationdelivery/:id', itemController.getItemDetails);
router.put('/reclamationdelivery', itemController.updateItem);
router.delete('/reclamationdelivery', itemController.deleteItem);

module.exports = router;
