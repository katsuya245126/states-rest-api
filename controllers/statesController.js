const State = require("../models/State");
const statesData = require("../models/statesData.json");

const getAllStates = async (req, res) => {
  res.json(statesData);
};

const getStateData = async (req, res) => {
  if (!req.params?.state) {
    return res.status(400).json({ message: "State parameter is required." });
  }

  const stateCode = req.params.state.toUpperCase();
  const stateData = statesData.find((state) => state.code === stateCode);

  if (!stateData) {
    return res.status(404).json({ error: "State not found" });
  }

  try {
    const stateFunFacts = await State.findOne({ stateCode }).exec();

    const result = {
      ...stateData,
      funfacts: stateFunFacts ? stateFunFacts.funfacts : [],
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching state information" });
  }
};

module.exports = { getAllStates, getStateData };
