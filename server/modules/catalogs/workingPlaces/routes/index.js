const express = require('express');
const router = express.Router(); 

const controllers = require('../controllers');
const accessRights = require('@middleware/accessRights');

router.get('/working_place', accessRights.canRead('working_places'), controllers.findAll);
router.get('/working_place/:id', accessRights.canRead('working_places'), controllers.findById);
router.post('/working_place', accessRights.canModify('working_places'), controllers.create);
router.put('/working_place/:id', accessRights.canModify('working_places'), controllers.update);
router.delete('/working_place/:id', accessRights.canModify('working_places'), controllers.delete);

module.exports = router;
