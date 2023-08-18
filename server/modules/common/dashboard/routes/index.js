const express = require('express');
const router = express.Router();

const controllers = require('../controllers');

router.get('/dashboard/dashboards', controllers.findAll);

module.exports = router;
