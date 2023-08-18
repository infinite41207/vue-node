const express = require('express');

const itemController = require('../controllers');
const router = express.Router();
const accessRights = require('@middleware/accessRights');

router.post('/reclamation_perpetrator', accessRights.canModify('reclamation_perpetrators'), itemController.create);
router.get('/reclamation_perpetrator', accessRights.canRead('reclamation_perpetrators'), itemController.findAll);
router.get('/reclamation_perpetrator/:id', accessRights.canRead('reclamation_perpetrators'), itemController.findById);
router.put('/reclamation_perpetrator', accessRights.canModify('reclamation_perpetrators'), itemController.update);
router.delete('/reclamation_perpetrator', accessRights.canModify('reclamation_perpetrators'), itemController.delete);

module.exports = router;
