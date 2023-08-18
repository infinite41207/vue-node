const express = require('express');
const router = express.Router();
const fileUpload = require('@middleware/fileUpload');

const controllers = require('../controllers');
const accessRights = require('@middleware/accessRights');

router.get('/task', accessRights.canRead('tasks'), controllers.findAll);
router.get('/task/:id', accessRights.canRead('tasks'), controllers.findById);
router.post('/task/', accessRights.canModify('tasks'), controllers.create);
router.put('/task/:id', accessRights.canModify('tasks'), controllers.update);
router.delete('/task/:id', accessRights.canModify('tasks'), controllers.delete);

router.post('/task/file', accessRights.canModify('tasks'), fileUpload.array('files'), controllers.attachFiles);
router.post('/task/object_file', accessRights.canModify('tasks'), controllers.getFiles);
router.get('/task/file/:id', accessRights.canRead('tasks'), controllers.getFile);
router.delete('/task/file/:id', accessRights.canModify('tasks'), controllers.deleteFile);

router.put('/execute_task/:id', accessRights.canModify('tasks'), controllers.execute);
router.put('/accept_exec_task/:id', accessRights.canModify('tasks'), controllers.acceptExecution);

module.exports = router;
