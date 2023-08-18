const express = require('express');
const router = express.Router();

const controllers = require('../controllers');

router.get('/report', controllers.findAll);
router.get('/report/:id', controllers.findById);
router.post('/report', controllers.create);
router.put('/report/:id', controllers.update);
router.delete('/report/:id', controllers.delete);

module.exports = router;
