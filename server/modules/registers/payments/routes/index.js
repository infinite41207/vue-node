const express = require("express");
const router = express.Router();

const controllers = require("../controllers");

router.get("/payment", controllers.findAll);
router.get("/payment/:id", controllers.findById);
router.post("/payment", controllers.create);
router.put("/payment/:id", controllers.update);
router.delete("/payment/:id", controllers.delete);

module.exports = router;
