const express = require('express');

const itemController = require('../controllers'); 	
const router = express.Router();
const accessRights = require('@middleware/accessRights')

router.post('/createreclamationstatusgroup', accessRights.canModify('reclamation_status_groups'), itemController.createItem);
router.get('/getallreclamationstatusgroups', accessRights.canRead('reclamation_status_groups'), itemController.getAllItems);
router.get('/getreclamationstatusgroup/:id', accessRights.canRead('reclamation_status_groups'), itemController.getItemDetails);
router.put('/updatereclamationstatusgroup', accessRights.canModify('reclamation_status_groups'), itemController.updateItem);
router.post('/deletereclamationstatusgroup', accessRights.canModify('reclamation_status_groups'), itemController.deleteItem);

router.get('/count_reclamation_status_groups', itemController.countAll);

module.exports = router;
