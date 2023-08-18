const express = require('express');
const router = express.Router();

const controllers = require('../controllers');
const accessRights = require('@middleware/accessRights')

router.post('/project', accessRights.canModify('projects'), controllers.create);
router.get('/project', accessRights.canRead('projects'), controllers.findAll);
router.get('/project/:id', accessRights.canRead('projects'), controllers.findById);
router.put('/project/:id', accessRights.canModify('projects'), controllers.update);

module.exports = router;
