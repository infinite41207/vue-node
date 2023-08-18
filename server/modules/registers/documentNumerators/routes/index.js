const express = require('express');

const itemController = require('../controllers');
const router = express.Router();
const accessRights = require('@middleware/accessRights');

router.post('/doc-numerator', accessRights.canModify('document_numerators'), itemController.createItem);
router.get('/doc-numerator', accessRights.canRead('document_numerators'), itemController.getAllItems);
router.get('/doc-numerator/:id', accessRights.canRead('document_numerators'), itemController.getItemDetails);
router.put('/doc-numerator/:id', accessRights.canModify('document_numerators'), itemController.updateItem);
router.delete('/doc-numerator/:id', accessRights.canModify('document_numerators'), itemController.deleteItem);

module.exports = router;
