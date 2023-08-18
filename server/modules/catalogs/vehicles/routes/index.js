const express = require('express');
const router = express.Router();

const controllers = require('../controllers');
const accessRights = require('@middleware/accessRights');

router.get('/vehicle', accessRights.canRead('vehicles'), controllers.findAll);
router.get('/vehicle/:id', accessRights.canRead('vehicles'), controllers.findById);
router.post('/vehicle', accessRights.canModify('vehicles'), controllers.create);
router.put('/vehicle/:id', accessRights.canModify('vehicles'), controllers.update);
router.delete('/vehicle/:id', accessRights.canModify('vehicles'), controllers.delete);

router.post('/vehicle/change_deletion_mark', accessRights.canModify('vehicles'), controllers.changeDeletionMark);

module.exports = router;
