const express = require('express');

const itemController = require('../controllers');
const fileUpload = require('@middleware/fileUpload');

const router = express.Router();
const accessRights = require('@middleware/accessRights');

router.get('/interaction', accessRights.canRead('interactions'), itemController.getAll);
router.get(`/interaction/count`, accessRights.canRead('interactions'), itemController.getCount)
router.get('/interaction/:id', accessRights.canRead('interactions'), itemController.getDetails);
router.post('/interaction', accessRights.canModify('interactions'), itemController.create);
router.put('/interaction/:id', accessRights.canModify('interactions'), itemController.update);
router.delete('/interaction/:id', accessRights.canModify('interactions'), itemController.delete);
router.post('/interaction/change_deletion_mark', accessRights.canModify('interactions'), itemController.changeDeletionMark);

router.post('/interaction/file', accessRights.canModify('interactions'), fileUpload.array('files'), itemController.attachFiles);
router.post('/interaction/files', accessRights.canModify('interactions'), itemController.getFiles);
router.put('/interaction/file/:id', accessRights.canModify('interactions'), itemController.updateFile);
router.post('/interaction/tasks', accessRights.canModify('interactions'), itemController.getTasks);
router.get('/interaction/file/:id', accessRights.canRead('interactions'), itemController.getFile);
router.delete('/interaction/file/:id', accessRights.canModify('interactions'), itemController.removeFile);

router.post('/interaction/comment', accessRights.canModify('interactions'), fileUpload.array('files'), itemController.addComment);
router.delete('/interaction/comment/:id', accessRights.canModify('interactions'), itemController.deleteComment);

router.post('/interaction/comment/file', accessRights.canModify('interactions'), fileUpload.array('files'), itemController.attachCommentFiles);
router.get('/interaction/comment/files', accessRights.canRead('interactions'), itemController.getCommentFiles);
router.get('/interaction/comment/file/:id', accessRights.canRead('interactions'), itemController.getCommentFile);
router.delete('/interaction/comment/file/:id', accessRights.canModify('interactions'), itemController.removeCommentFile);

module.exports = router;
