const express = require('express');

const itemController = require('../controllers');
const router = express.Router();
const accessRights = require('@middleware/accessRights'); 	

router.post('/standing', accessRights.canRead('standings'), itemController.create);
router.get('/standing', accessRights.canRead('standings'), itemController.findAll);
router.get('/standing/:id', accessRights.canRead('standings'), itemController.findById);
router.put('/standing/:id', accessRights.canRead('standings'), itemController.update);
router.delete('/standing/:id', accessRights.canRead('standings'), itemController.delete);

module.exports = router;
