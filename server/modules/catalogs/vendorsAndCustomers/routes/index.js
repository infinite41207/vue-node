const express = require('express');
const router = express.Router();

const controllers = require('../controllers');
const accessRights = require('@middleware/accessRights')

router.get('/vendor_and_customer', accessRights.canRead('vendors_and_customers'), controllers.findAll);
router.get('/vendor_and_customer/:id', accessRights.canRead('vendors_and_customers'), controllers.findById);
router.post('/vendor_and_customer', accessRights.canModify('vendors_and_customers'), controllers.create);
router.put('/vendor_and_customer/:id', accessRights.canModify('vendors_and_customers'), controllers.update);
router.delete('/vendor_and_customer/:id', accessRights.canModify('vendors_and_customers'), controllers.delete);

router.post('/vendor_and_customer/change_deletion_mark', accessRights.canModify('vendors_and_customers'), controllers.changeDeletionMark);

module.exports = router;
