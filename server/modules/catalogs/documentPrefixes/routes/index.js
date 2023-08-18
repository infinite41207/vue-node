const express = require('express');

const controllers = require('../controllers');
const router = express.Router();
const accessRights = require('@middleware/accessRights');

router.post('/doc_prefix', accessRights.canModify('document_prefixes'), controllers.create);
router.get('/doc_prefix', accessRights.canRead('document_prefixes'), controllers.getAll);
router.get('/doc_prefix/:id', accessRights.canRead('document_prefixes'), controllers.findById);
router.put('/doc_prefix/:id', accessRights.canModify('document_prefixes'), controllers.update);
router.delete('/doc_prefix/:id', accessRights.canModify('document_prefixes'), controllers.delete);

module.exports = router;
