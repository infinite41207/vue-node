const express = require('express');
const router = express.Router();

const controllers = require('../controllers');
const accessRights = require('@middleware/accessRights')

router.get('/pricelist', accessRights.canRead('pricelists'), controllers.findAll);
router.get('/pricelist/:id', accessRights.canRead('pricelists'), controllers.findById);
router.post('/pricelist/calculate_prices', accessRights.canModify('pricelists'), controllers.calculateProductPrices);

module.exports = router;
