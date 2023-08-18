const express = require('express');

const itemController = require('../controllers');
const router = express.Router();
const accessRights = require('@middleware/accessRights')

router.post('/client_demand', accessRights.canRead('reclamation_client_demands'), itemController.create);
router.get('/client_demand', accessRights.canRead('reclamation_client_demands'), itemController.findAll);
router.get('/client_demand/:id', accessRights.canRead('reclamation_client_demands'), itemController.findById);
router.put('/client_demand/:id', accessRights.canRead('reclamation_client_demands'), itemController.update);
router.delete('/client_demand/:id', accessRights.canRead('reclamation_client_demands'), itemController.delete);

module.exports = router;
