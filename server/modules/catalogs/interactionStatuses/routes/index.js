const express = require('express');
const itemController = require('../controllers');
const router = express.Router();
const accessRights = require('@middleware/accessRights');

router.post('/interaction_status', accessRights.canModify('interaction_statuses'), itemController.create);
router.get('/interaction_status', accessRights.canRead('interaction_statuses'), itemController.getAll);
router.get('/interaction_status/:id', accessRights.canRead('interaction_statuses'), itemController.getDetails);
router.put('/interaction_status', accessRights.canModify('interaction_statuses'), itemController.update);
router.delete('/interaction_status/:id', accessRights.canModify('interaction_statuses'), itemController.delete);

module.exports = router;
