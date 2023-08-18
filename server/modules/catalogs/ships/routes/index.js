const express = require('express');
const router = express.Router();

const controllers = require('../controllers');
const accessRights = require('@middleware/accessRights');

router.get('/ship', accessRights.canRead('ships'), controllers.findAll);
router.get('/ship/:id', accessRights.canRead('ships'), controllers.findById);
router.post('/ship', accessRights.canModify('ships'), controllers.create);
router.put('/ship/:id', accessRights.canModify('ships'), controllers.update);
router.delete('/ship/:id', accessRights.canModify('ships'), controllers.delete);

router.post('/ship/change_deletion_mark', accessRights.canModify('ships'), controllers.changeDeletionMark);

module.exports = router;
