const express = require('express');

const itemController = require('../controllers/reclamationCosts');

const router = express.Router();

router.post('/reclamation_cost', itemController.create);
router.get('/reclamation_cost', itemController.findAll);
router.get('/reclamation_cost/:id', itemController.findById);
router.put('/reclamation_cost/:id', itemController.update);
router.delete('/reclamation_cost/:id', itemController.delete);

module.exports = router;
