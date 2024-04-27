const express = require("express");
const router = express.Router();
const statesController = require("../controllers/statesController");

router.get("/", (req, res) => {
  if (req.query.contig) {
    return statesController.getStatesByContiguity(req, res);
  }
  statesController.getAllStates(req, res);
});

router.get("/:state", statesController.getStateData);

module.exports = router;
