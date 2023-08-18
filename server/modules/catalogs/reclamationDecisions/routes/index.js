const express = require('express');

const itemController = require('../controllers');
const router = express.Router();
const accessRights = require('@middleware/accessRights')

router.post('/reclamation_decision', accessRights.canModify('reclamation_decisions'), itemController.create);
router.get('/reclamation_decision', accessRights.canRead('reclamation_decisions'), itemController.findAll);
router.get('/reclamation_decision/:id', accessRights.canRead('reclamation_decisions'), itemController.findById);
router.put('/reclamation_decision', accessRights.canModify('reclamation_decisions'), itemController.update);
router.delete('/reclamation_decision', accessRights.canModify('reclamation_decisions'), itemController.delete);

module.exports = router;
