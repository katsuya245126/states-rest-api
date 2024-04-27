const express = require("express");
const router = express.Router();
const statesController = require("../controllers/statesController");

router.route("/").get(statesController.getAllStates);
router.get("/:state", statesController.getStateData);

module.exports = router;
