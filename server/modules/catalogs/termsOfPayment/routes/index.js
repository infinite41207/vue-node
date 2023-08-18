const express = require('express');
const router = express.Router();

const controllers = require('../controllers');
const accessRights = require('@middleware/accessRights');

router.get('/term_of_payment', accessRights.canRead('terms_of_payment'), controllers.findAll);
router.get('/term_of_payment/:id', accessRights.canRead('terms_of_payment'), controllers.findById);
router.post('/term_of_payment', accessRights.canModify('terms_of_payment'), controllers.create);
router.put('/term_of_payment/:id', accessRights.canModify('terms_of_payment'), controllers.update);
router.delete('/term_of_payment/:id', accessRights.canModify('terms_of_payment'), controllers.delete);

module.exports = router;
