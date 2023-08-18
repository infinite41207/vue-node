const express = require('express');

const itemController = require('../controllers');
const router = express.Router();
const accessRights = require('@middleware/accessRights');

router.post('/reclamation_reason', accessRights.canModify('reclamation_reasons'), itemController.create);
router.get('/reclamation_reason', accessRights.canRead('reclamation_reasons'), itemController.findAll);
router.get('/reclamation_reason/:id', accessRights.canRead('reclamation_reasons'), itemController.findById);
router.put('/reclamation_reason', accessRights.canModify('reclamation_reasons'), itemController.update);
router.delete('/reclamation_reason', accessRights.canModify('reclamation_reasons'), itemController.delete);

module.exports = router;