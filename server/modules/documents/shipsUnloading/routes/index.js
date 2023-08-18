const express = require("express");
const router = express.Router();

const controllers = require("../controllers");
const accessRights = require('@middleware/accessRights')

router.get("/ship_unloading", accessRights.canRead('ships_unloading'), controllers.findAll);
router.get("/ship_unloading/:id", accessRights.canRead('ships_unloading'), controllers.findById);
router.post("/ship_unloading", accessRights.canModify('ships_unloading'), controllers.create);
router.put("/ship_unloading/:id", accessRights.canModify('ships_unloading'), controllers.update);
router.delete("/ship_unloading/:id", accessRights.canModify('ships_unloading'), controllers.delete);
router.get("/ship_unloading/subordination/:id", accessRights.canRead('ships_unloading'), controllers.getSubordination);

router.post("/ship_unloading/change_deletion_mark", accessRights.canModify('ships_unloading'), controllers.changeDeletionMark);

module.exports = router;
