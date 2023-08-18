const express = require('express');
const router = express.Router();

const controllers = require('../controllers/expressionVariable');

router.post('/expression_variables', controllers.findAll);

module.exports = router;
