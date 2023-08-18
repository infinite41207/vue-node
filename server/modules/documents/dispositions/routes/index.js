const express = require('express')
const router = express.Router()
const accessRights = require('@middleware/accessRights')

const controllers = require('../controllers')

router.get('/disposition', accessRights.canRead('dispositions'), controllers.findAll)
router.get('/disposition/:id', accessRights.canRead('dispositions'), controllers.findById)
router.post('/disposition', accessRights.canModify('dispositions'), controllers.create)
router.put('/disposition/:id', accessRights.canModify('dispositions'), controllers.update)
router.delete('/disposition/:id', accessRights.canModify('dispositions'), controllers.delete)

router.get('/disposition_first_weighting', accessRights.canRead('dispositions'), controllers.findFirstWeighting)
router.get('/disposition_second_weighting', accessRights.canRead('dispositions'), controllers.findSecondWeighting)
router.get('/disposition_by_ticket', accessRights.canRead('dispositions'), controllers.findByTicket)
router.get('/disposition_number_of_weighted', accessRights.canRead('dispositions'), controllers.getNumberOfWeighted)
router.post('/disposition/change_deletion_mark', accessRights.canModify('dispositions'), controllers.changeDeletionMark)

module.exports = router
