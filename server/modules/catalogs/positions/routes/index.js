const express = require('express');
const router = express.Router();

const controllers = require('../controllers');
const accessRights = require('@middleware/accessRights');

router.get('/position', accessRights.canRead('positions'), controllers.findAll);
router.get('/position/:id', accessRights.canRead('positions'), controllers.findById);
router.post('/position', accessRights.canModify('positions'), controllers.create);
router.put('/position/:id', accessRights.canModify('positions'), controllers.update);
router.delete('/position/:id', accessRights.canModify('positions'), controllers.delete);

module.exports = router;
