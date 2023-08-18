const express = require('express');
const router = express.Router();

const controllers = require('../controllers');
const accessRights = require('@middleware/accessRights')

router.get('/executor_role', accessRights.canRead('executor_roles'), controllers.findAll);
router.get('/executor_role/:id', accessRights.canRead('executor_roles'), controllers.findById);
router.post('/executor_role', accessRights.canModify('executor_roles'), controllers.create);
router.put('/executor_role/:id', accessRights.canModify('executor_roles'), controllers.update);
router.delete('/executor_role/:id', accessRights.canModify('executor_roles'), controllers.remove);

module.exports = router;
