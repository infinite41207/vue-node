const express = require('express');
const router = express.Router();

const controllers = require('../controllers');

router.get('/trackModel', controllers.findAll);
router.get('/trackModel/:id', controllers.findById);
router.post('/trackModel', controllers.create);
router.put('/trackModel/:id', controllers.update);
router.delete('/trackModel/:id', controllers.delete);

module.exports = router;
