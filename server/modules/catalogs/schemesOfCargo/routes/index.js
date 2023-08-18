const express = require('express');
const router = express.Router(); 

const controllers = require('../controllers');
const accessRights = require('@middleware/accessRights');

router.get('/scheme_of_cargo', accessRights.canRead('schemes_of_cargo'), controllers.findAll);
router.get('/scheme_of_cargo/:id', accessRights.canRead('schemes_of_cargo'), controllers.findById);
router.post('/scheme_of_cargo', accessRights.canModify('schemes_of_cargo'), controllers.create);
router.put('/scheme_of_cargo/:id', accessRights.canModify('schemes_of_cargo'), controllers.update);
router.delete('/scheme_of_cargo/:id', accessRights.canModify('schemes_of_cargo'), controllers.delete);

router.post('/scheme_of_cargo/change_deletion_mark', accessRights.canModify('schemes_of_cargo'), controllers.changeDeletionMark);

module.exports = router;
