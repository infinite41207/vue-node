const express = require('express');

const itemController = require('../controllers');
const router = express.Router();
const accessRights = require('@middleware/accessRights');

router.post('/reclamation_execution_type', accessRights.canModify('reclamation_execution_types'), itemController.createItem);
router.get('/reclamation_execution_type', accessRights.canRead('reclamation_execution_types'), itemController.findAll);
router.get('/reclamation_execution_type/:id', accessRights.canRead('reclamation_execution_types'), itemController.findByPk);
router.put('/reclamation_execution_type', accessRights.canModify('reclamation_execution_types'), itemController.updateItem);
router.delete('/reclamation_execution_type', accessRights.canModify('reclamation_execution_types'), itemController.deleteItem);

module.exports = router;
