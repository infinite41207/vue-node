const express = require('express');

const itemController = require('../controllers/reclamation');
const router = express.Router();
const accessRights = require('@middleware/accessRights');

router.post('/reclamation', accessRights.canModify('reclamations'), itemController.create);
router.get('/reclamation', accessRights.canRead('reclamations'), itemController.getAllItems);
router.get('/reclamation/:id', accessRights.canRead('reclamations'), itemController.findById);
router.put('/reclamation/:id', accessRights.canModify('reclamations'), itemController.updateItem);
router.delete('/reclamation', accessRights.canModify('reclamations'), itemController.deleteItem);

module.exports = router;
