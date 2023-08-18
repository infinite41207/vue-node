const express = require('express');
const router = express.Router();

const controllers = require('../controllers');
const accessRights = require('@middleware/accessRights');

router.get('/uom', accessRights.canRead('units_of_measure'), controllers.findAll);
router.get('/uom/:id', accessRights.canRead('units_of_measure'), controllers.findById);
router.post('/uom', accessRights.canModify('units_of_measure'), controllers.create);
router.put('/uom/:id', accessRights.canModify('units_of_measure'), controllers.update);
router.delete('/uom/:id', accessRights.canModify('units_of_measure'), controllers.delete);

module.exports = router;
