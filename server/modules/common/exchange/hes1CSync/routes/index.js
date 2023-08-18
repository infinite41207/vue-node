const express = require("express");

const controllerGet = require("../controllers/index");
const itemControllerSend = require("../controllers/sendData");

const router = express.Router();

router.get("/get_from_1c", controllerGet);
router.get("/send_to_1c", itemControllerSend.sendTo1c);

module.exports = router;
