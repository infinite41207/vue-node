const express = require('express');
const router = express.Router();

const controllers = require('../controllers');

router.get('/payment_operation', controllers.findAll);
router.get('/payment_operation/:id', controllers.findById);
router.post('/payment_operation', controllers.create);
router.put('/payment_operation/:id', controllers.update);
router.delete('/payment_operation/:id', controllers.delete);

router.post('/payment_operation/change_deletion_mark', controllers.changeDeletionMark)

module.exports = router;
