const express = require('express');
const router = express.Router();

const controllers = require('../controllers/parameterValue');

router.get('/parameter_value/:id', controllers.findById);
router.post('/parameter_value', controllers.findAll);
router.post('/selected_value', controllers.findSelected);
router.post('/next_param_value', controllers.findNextValues);

module.exports = router;
