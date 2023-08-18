const express = require('express');
const router = express.Router();

const controllers = require('../controllers');
const accessRights = require('@middleware/accessRights');

router.get('/weighing_station', accessRights.canRead('weighing_stations'), controllers.findAll);
router.get('/weighing_station/:id', accessRights.canRead('weighing_stations'), controllers.findById);
router.post('/weighing_station', accessRights.canModify('weighing_stations'), controllers.create);
router.put('/weighing_station/:id', accessRights.canModify('weighing_stations'), controllers.update);
router.delete('/weighing_station/:id', accessRights.canModify('weighing_stations'), controllers.delete);

module.exports = router;
