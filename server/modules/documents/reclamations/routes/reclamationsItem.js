const express = require('express');

const itemController = require('../controllers/reclamationItem');
const router = express.Router();

router.post('/reclamation_item', itemController.create);
router.get('/reclamation_item', itemController.findAll);
router.get('/reclamation_item/:id', itemController.findById);
router.put('/reclamation_item/:id', itemController.update);
router.delete('/reclamation_item', itemController.deleteItem);
router.post('/deleteallreclamationitems', itemController.deleteAllItems);

module.exports = router;
