const express = require('express');
const router = express.Router();

const controllers = require('../controllers');
const accessRights = require('@middleware/accessRights');

router.get('/discount', accessRights.canRead('discounts'), controllers.findAll);
router.get('/discount/:id', accessRights.canRead('discounts'), controllers.findById);

module.exports = router;
