const express = require('express');

const itemController = require('../controllers');
const router = express.Router();
const accessRights = require('@middleware/accessRights');

router.post('/reclamation_subject', accessRights.canModify('reclamation_subjects'), itemController.create);
router.get('/reclamation_subject', accessRights.canRead('reclamation_subjects'), itemController.findAll);
router.get('/reclamation_subject/:id', accessRights.canRead('reclamation_subjects'), itemController.findById);
router.put('/reclamation_subject/:id', accessRights.canModify('reclamation_subjects'), itemController.update);
router.delete('/reclamation_subject/:id', accessRights.canModify('reclamation_subjects'), itemController.delete);

module.exports = router;
