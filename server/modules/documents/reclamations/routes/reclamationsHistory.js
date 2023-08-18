const express = require('express');

const itemController = require('../controllers/reclamationHistory');
const router = express.Router();

router.post('/reclamation_history', itemController.create);
router.get('/reclamation_history', itemController.findAll);
router.get('/reclamation_history/:id', itemController.findById);
router.put('/reclamation_history/:id', itemController.update);
router.delete('/reclamation_history', itemController.delete);

module.exports = router;
