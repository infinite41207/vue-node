const express = require('express');
const router = express.Router();

const controllers = require('../controllers/parameterProperty');

router.get('/param_prop', controllers.findAll);
router.get('/param_prop/:id', controllers.findById);

module.exports = router;
