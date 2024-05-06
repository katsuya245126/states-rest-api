const express = require("express");
const router = express.Router();
const validateState = require("../middleware/validateState");
const statesController = require("../controllers/statesController");
const path = require("path");

// GET METHODS

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

// POST METHODS

router.post("/:state/funfact", validateState, statesController.addFunFacts);

// PATCH METHODS

router.patch("/:state/funfact", validateState, statesController.updateFunFact);

// DELETE METHODS

router.delete("/:state/funfact", validateState, statesController.deleteFunFact);

// CATCH-ALL METHOD

router.all("*", (req, res) => {
    res.status(404).sendFile(path.join(__dirname, "../public", "404.html"));
});

module.exports = router;
