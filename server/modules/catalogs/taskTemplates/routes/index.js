const express = require('express');
const router = express.Router();

const controllers = require('../controllers');
const accessRights = require('@middleware/accessRights');

router.get('/task_template', accessRights.canRead('task_templates'), controllers.findAll);
router.get('/task_template/:id', accessRights.canRead('task_templates'), controllers.findById);

module.exports = router;
