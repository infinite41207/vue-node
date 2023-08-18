const express = require('express');
const router = express.Router();

const controllers = require('../controllers/propertyValue');

router.get('/prop_value', controllers.findAll);
router.get('/prop_value/:id', controllers.findById);

module.exports = router;
