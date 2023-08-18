const express = require('express');

const itemController = require('../controllers');
const router = express.Router();
const accessRights = require('@middleware/accessRights'); 	

router.post('/createreclamationstatus', accessRights.canRead('reclamation_statuses'), itemController.createItem);
router.get('/getallreclamationstatuses', accessRights.canRead('reclamation_statuses'), itemController.getAllItems);
router.get('/getreclamationstatus/:id', accessRights.canRead('reclamation_statuses'), itemController.getItemDetails);
router.put('/updatereclamationstatus', accessRights.canRead('reclamation_statuses'), itemController.updateItem);
router.post('/deletereclamationstatus', accessRights.canRead('reclamation_statuses'), itemController.deleteItem);

module.exports = router;
