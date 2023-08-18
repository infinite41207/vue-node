const express = require('express');

const itemController = require('../controllers');
const router = express.Router();
const accessRights = require('@middleware/accessRights');

router.post('/reclamation_type', accessRights.canModify('reclamation_types'), itemController.createItem);
router.get('/reclamation_type', accessRights.canRead('reclamation_types'), itemController.findAll);
router.get('/reclamation_type/:id', accessRights.canRead('reclamation_types'), itemController.findByPk);
router.put('/reclamation_type/:id', accessRights.canModify('reclamation_types'), itemController.updateItem);
router.delete('/reclamation_type/:id', accessRights.canModify('reclamation_types'), itemController.deleteItem);

module.exports = router;
