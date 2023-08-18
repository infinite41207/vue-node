const express = require("express");
const router = express.Router();

const controllers = require("../controllers");

router.get("/plumb_line", controllers.findAll);
router.get("/plumb_line/:id", controllers.findById);
router.post("/plumb_line", controllers.create);
router.put("/plumb_line/:id", controllers.update);
router.delete("/plumb_line/:id", controllers.delete);

module.exports = router;
