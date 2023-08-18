const express = require("express");
const router = express.Router();

const controllers = require("../controllers");

router.get("/inventory", controllers.findAll);
router.get("/inventory/:id", controllers.findById);
router.post("/inventory", controllers.create);
router.put("/inventory/:id", controllers.update);
router.delete("/inventory/:id", controllers.delete);

module.exports = router;
