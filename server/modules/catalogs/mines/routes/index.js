const express = require('express');
const router = express.Router();

const accessRights = require('@middleware/accessRights')
const controllers = require('../controllers');

router.get('/mine', accessRights.canRead('mines'), controllers.findAll);
router.get('/mine/:id', accessRights.canRead('mines'), controllers.findById);
router.post('/mine', accessRights.canModify('mines'), controllers.create);
router.put('/mine/:id', accessRights.canModify('mines'), controllers.update);
router.delete('/mine/:id', accessRights.canModify('mines'), controllers.delete);

router.post('/mine/change_deletion_mark', accessRights.canModify('mines'), controllers.changeDeletionMark);

module.exports = router;
