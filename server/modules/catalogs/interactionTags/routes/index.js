const express = require('express');
const itemController = require('../controllers');
const router = express.Router();
const accessRights = require('@middleware/accessRights');

router.post('/interaction_tag', accessRights.canModify('interaction_tags'), itemController.create);
router.get('/interaction_tag', accessRights.canRead('interaction_tags'), itemController.getAll);
router.get('/interaction_tag/:id', accessRights.canRead('interaction_tags'), itemController.getDetails);
router.put('/interaction_tag', accessRights.canModify('interaction_tags'), itemController.update);
router.delete('/interaction_tag/:id', accessRights.canModify('interaction_tags'), itemController.delete);

module.exports = router;
