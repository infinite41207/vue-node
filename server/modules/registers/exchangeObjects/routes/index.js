const express = require('express');
const router = express.Router();

const controllers = require('../controllers');
const accessRights = require('@middleware/accessRights');

router.get('/exchange_object/all', accessRights.canRead('exchange'), controllers.findAll);
router.put('/exchange_object/', accessRights.canRead('exchange'), controllers.update);
router.delete('/exchange_object/:id', accessRights.canRead('exchange'), controllers.delete);
router.get('/exchange/sync', accessRights.canRead('exchange'), controllers.objectsSend);
router.post('/exchange/sync', accessRights.canRead('exchange'), controllers.objectsLoad);
router.post('/exchange/confirm_exchange', accessRights.canRead('exchange'), controllers.confirmExchange);

module.exports = router;
