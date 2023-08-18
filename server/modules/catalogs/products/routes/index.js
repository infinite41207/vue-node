const express = require('express');
const router = express.Router();

const accessRights = require('@middleware/accessRights');
const controllers = require('../controllers');

router.get('/product', accessRights.canRead('products'), controllers.findAll);
router.get('/product/:id', accessRights.canRead('products'), controllers.findById);
router.put('/product/:id', accessRights.canModify('products'), controllers.update);
router.post('/product', accessRights.canModify('products'), controllers.create);
router.post('/product/getPrice', accessRights.canModify('products'), controllers.getPrice);

router.post('/product/change_deletion_mark', accessRights.canModify('products'), controllers.changeDeletionMark);

module.exports = router;
