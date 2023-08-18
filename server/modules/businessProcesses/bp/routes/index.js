const express = require('express');

const itemController = require('../controllers');
const router = express.Router();
const accessRights = require('@middleware/accessRights');

router.post('/bp_exemplar', accessRights.canModify('business_processes'), itemController.createItem);
router.get('/bp_exemplars', accessRights.canRead('business_processes'), itemController.getAllItems);
router.get('/bp_exemplar/:id', accessRights.canRead('business_processes'), itemController.getItemDetails);
router.put('/bp_exemplar', accessRights.canModify('business_processes'), itemController.updateItem);
router.delete('/bp_exemplar', accessRights.canModify('business_processes'), itemController.deleteItem);

module.exports = router;
