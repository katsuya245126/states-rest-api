const express = require("express");
const router = express.Router();
const validateState = require("../middleware/validateState");
const statesController = require("../controllers/statesController");

router.get("/", (req, res) => {
  if (req.query.contig) {
    return statesController.getStatesByContiguity(req, res);
  }
  statesController.getAllStates(req, res);
});

router.get("/:state", validateState, statesController.getStateData);

router.get("/:state/capital", validateState, statesController.getStateCapital);

router.get(
  "/:state/nickname",
  validateState,
  statesController.getStateNickname
);

router.get(
  "/:state/population",
  validateState,
  statesController.getStatePopulation
);

router.get(
  "/:state/admission",
  validateState,
  statesController.getStateAdmissionDate
);

router.get("/:state/funfact", validateState, statesController.getRandomFunFact);

module.exports = router;
