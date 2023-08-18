const express = require('express')
const router = express.Router()
const accessRights = require('@middleware/accessRights')

const mailboxController = require('../controllers')
const incomingEmailController = require('@documents/incomingEmails/controllers')

router.get('/mailbox', accessRights.canRead('mailbox'), mailboxController.getMailBoxInfo)
router.get('/email', accessRights.canRead('mailbox'), mailboxController.getAll, incomingEmailController.findAll)
router.get('/email/:id', accessRights.canRead('mailbox'), incomingEmailController.findById)
router.get('/email_seq/:id', accessRights.canRead('mailbox'), mailboxController.getEmailDetailsBySeq)
router.get('/email_uid/:id', accessRights.canRead('mailbox'), mailboxController.getEmailDetailsByUid, incomingEmailController.findByUid)
router.post('/email_seen', accessRights.canModify('mailbox'), mailboxController.setEmailSeen)
router.post('/email_unseen', accessRights.canModify('mailbox'), mailboxController.setEmailUnseen)
router.post('/email_flag', accessRights.canModify('mailbox'), mailboxController.setEmailFlag)
router.post('/email_label', accessRights.canModify('mailbox'), incomingEmailController.setLabel)
router.post('/email_move', accessRights.canModify('mailbox'), mailboxController.moveEmail)

module.exports = router
