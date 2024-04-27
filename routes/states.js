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

router.get("/:state/capital", statesController.getStateCapital);
router.get("/:state/nickname", statesController.getStateNickname);
router.get("/:state/population", statesController.getStatePopulation);
router.get("/:state/admission", statesController.getStateAdmissionDate);
router.get("/:state/funfact", statesController.getRandomFunFact);

module.exports = router;
