const express = require('express')
const router = express.Router()

const accessRights = require('@middleware/accessRights')
const controllers = require('../controllers')

router.get('/delivery_note', accessRights.canRead('delivery_notes'), controllers.findAll)
router.get('/delivery_note/:id', accessRights.canRead('delivery_notes'), controllers.findById)
// router.get("/delivery_note_for_weighting/:dispositionId", controllers.findForWeighting);
router.get('/delivery_note_for_weighting', accessRights.canRead('delivery_notes'), controllers.findForWeighting)
router.get('/delivery_note_last_tare/:dispositionId', accessRights.canRead('delivery_notes'), controllers.findLastTare)
router.get('/delivery_note_by_order', accessRights.canRead('delivery_notes'), controllers.findByDeliveryOrder)
router.post('/delivery_note', accessRights.canModify('delivery_notes'), controllers.create)
router.put('/delivery_note/:id', accessRights.canModify('delivery_notes'), controllers.update)
router.delete('/delivery_note/:id', accessRights.canModify('delivery_notes'), controllers.delete)

router.post('/delivery_note/change_deletion_mark', accessRights.canModify('delivery_notes'), controllers.changeDeletionMark)
module.exports = router
