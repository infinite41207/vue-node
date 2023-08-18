const express = require('express');
const router = express.Router();

const controllers = require('../controllers');
const accessRights = require('@middleware/accessRights');

router.get('/outgoing_email', accessRights.canRead('outgoing_emails'), controllers.getAll);
router.get('/outgoing_email/:id', accessRights.canRead('outgoing_emails'), controllers.findById);
router.post('/outgoing_email', accessRights.canModify('outgoing_emails'), controllers.create);
router.post('/outgoing_email/send', accessRights.canModify('outgoing_emails'), controllers.resendEmail);
router.put('/outgoing_email/:id', accessRights.canModify('outgoing_emails'), controllers.update);
router.get('/outgoing_email_linked_doc', accessRights.canRead('outgoing_emails'), controllers.getLinkedDocs);

module.exports = router;
