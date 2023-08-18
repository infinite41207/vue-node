const express = require('express');
const router = express.Router();

const controllers = require('../controllers');
const accessRights = require('@middleware/accessRights');

router.get('/warehouse', accessRights.canRead('warehouses'), controllers.findAll);
router.get('/warehouse/:id', accessRights.canRead('warehouses'), controllers.findById);
router.post('/warehouse', accessRights.canModify('warehouses'), controllers.create);
router.put('/warehouse/:id', accessRights.canModify('warehouses'), controllers.update);
router.delete('/warehouse/:id', accessRights.canModify('warehouses'), controllers.delete);

module.exports = router;
