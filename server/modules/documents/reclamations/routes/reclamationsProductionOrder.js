const express = require('express');

const itemController = require('../controllers/reclamationProductionOrder');
const router = express.Router();

router.post('/reclamation_production_order', itemController.create);
router.get('/reclamation_production_order', itemController.findAll);
router.get('/reclamation_production_order/:id', itemController.findById);
router.put('/reclamation_production_order/:id', itemController.update);
router.delete('/reclamation_production_order', itemController.delete);

module.exports = router;
