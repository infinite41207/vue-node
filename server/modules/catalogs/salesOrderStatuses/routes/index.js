const express = require('express');
const router = express.Router();

const controllers = require('../controllers'); 
const accessRights = require('@middleware/accessRights');

router.get('/sales_order_status', accessRights.canRead('sales_order_statuses'), controllers.findAll);
router.get('/sales_order_status/:id', accessRights.canRead('sales_order_statuses'), controllers.findById);
router.post('/sales_order_status', accessRights.canModify('sales_order_statuses'), controllers.create);
router.put('/sales_order_status/:id', accessRights.canModify('sales_order_statuses'), controllers.update);
router.delete('/sales_order_status/:id', accessRights.canModify('sales_order_statuses'), controllers.delete);

module.exports = router;
