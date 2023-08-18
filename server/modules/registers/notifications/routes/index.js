const express = require('express');
const router = express.Router();

const controllers = require('../controllers');

router.get('/notification', controllers.findAll);
router.get('/notification/:id', controllers.findById);
router.put('/notification/:id', controllers.update);

module.exports = router;
