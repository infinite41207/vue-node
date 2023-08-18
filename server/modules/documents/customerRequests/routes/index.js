const express = require('express');

const itemController = require('../controllers');
const fileUpload = require('@middleware/fileUpload');
const accessRights = require('@middleware/accessRights')

const router = express.Router();

router.post('/customer_request', accessRights.canModify('customer_requests'), itemController.create);
router.get('/customer_request', accessRights.canRead('customer_requests'), itemController.getAll);
router.get('/customer_request/count', accessRights.canRead('customer_requests'), itemController.getCount);
router.get('/customer_request/amount', accessRights.canRead('customer_requests'), itemController.getAmount);
router.get('/customer_request/:id', accessRights.canRead('customer_requests'), itemController.getDetails);
router.put('/customer_request/:id', accessRights.canModify('customer_requests'), itemController.update);
router.delete('/customer_request/:id', accessRights.canModify('customer_requests'), itemController.delete);

router.post('/customer_request/change_deletion_mark', accessRights.canModify('customer_requests'), itemController.changeDeletionMark);

router.post('/customer_request/file', accessRights.canModify('customer_requests'), fileUpload.array('files'), itemController.attachCRFiles);
router.post('/customer_request/cr_file', accessRights.canModify('customer_requests'), itemController.getCRFiles);
router.post('/customer_request/file_by_number', accessRights.canModify('customer_requests'), itemController.getCRFilesByNumber);
router.post('/customer_request/by_number', accessRights.canModify('customer_requests'), itemController.getByNumber);
router.get('/customer_request/cr_file/:id', accessRights.canRead('customer_requests'), itemController.getCRFile);
router.delete('/customer_request/cr_file/:id', accessRights.canModify('customer_requests'), itemController.removeCRFile);

router.post('/customer_request/add_comment', accessRights.canModify('customer_requests'), fileUpload.array('files'), itemController.addComment);
router.delete('/customer_request/comment/:id', accessRights.canModify('customer_requests'), itemController.deleteComment);
router.post('/customer_request/comment_file', accessRights.canModify('customer_requests'), fileUpload.array('files'), itemController.attachCRCommentFiles);
router.post('/customer_request/cr_comment_file', accessRights.canModify('customer_requests'), itemController.getCRCommentFiles);
router.get('/customer_request/cr_comment_file/:id', accessRights.canRead('customer_requests'), itemController.getCRCommentFile);
router.delete('/customer_request/cr_comment_file/:id', accessRights.canModify('customer_requests'), itemController.removeCRCommentFile);

module.exports = router;
