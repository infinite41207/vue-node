const express = require('express');
const router = express.Router();

const controllers = require('../controllers/parameter');

router.get('/product_parameter/:id', controllers.findById);
router.post('/product_parameter', controllers.findAll);

module.exports = router;
