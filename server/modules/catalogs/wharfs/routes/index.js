const express = require('express');
const router = express.Router();

const controllers = require('../controllers');

router.get('/wharf', controllers.findAll);
router.get('/wharf/:id', controllers.findById);
router.post('/wharf', controllers.create);
router.put('/wharf/:id', controllers.update);
router.delete('/wharf/:id', controllers.delete);

module.exports = router;
