const statesData = require("../models/statesData.json");

const validateState = (req, res, next) => {
    const stateCode = req.params.state.toUpperCase();
    const stateData = statesData.find((state) => state.code === stateCode);

    if (!stateData) {
        return res
            .status(404)
            .json({ message: "Invalid state abbreviation parameter" });
    }

    // If the state exists, attach the state's data to the request object
    req.stateData = stateData;
    next();
};

module.exports = validateState;
