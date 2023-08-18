const express = require('express')
const router = express.Router()

const controllers = require('../controllers')
const accessRights = require('@middleware/accessRights')

router.get('/incoming_email', accessRights.canRead('incoming_emails'), controllers.findAll)
router.get('/incoming_email/:id', accessRights.canRead('incoming_emails'), controllers.findById)
router.put('/incoming_email/:id', accessRights.canModify('incoming_emails'), controllers.update)
router.post('/incoming_email_attachment', accessRights.canModify('incoming_emails'), controllers.getAttachmetContent)
router.get('/incoming_email_linked_doc', accessRights.canRead('incoming_emails'), controllers.getLinkedDocs)
router.get('/incoming_email/file/:id', accessRights.canRead('incoming_emails'), controllers.getFile)
router.get('/incoming_email_files', accessRights.canRead('incoming_emails'), controllers.getFiles)
router.delete('/incoming_email/linked_doc/:id', accessRights.canModify('incoming_emails'), controllers.deleteLinkedDoc)

module.exports = router
