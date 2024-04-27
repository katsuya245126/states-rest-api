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

const getStatesByContiguity = async (req, res) => {
  // Extract the value of the contig query parameter from req
  const { contig } = req.query;

  try {
    // Convert from string to bool
    const isContiguous = contig === "true";

    // Filter statesData based on contiguity
    const filteredStates = statesData.filter((state) => {
      const nonContiguous = ["AK", "HI"];

      // Determine if the current state should be included based on contiguity
      // if isContiguous = true, current state should not be included the nonContiguous array
      return isContiguous
        ? !nonContiguous.includes(state.code)
        : nonContiguous.includes(state.code);
    });

    res.json(filteredStates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStateCapital = (req, res) => {
  const stateCode = req.params.state.toUpperCase();
  const stateData = statesData.find((state) => state.code === stateCode);

  if (stateData) {
    res.json({ state: stateData.state, capital: stateData.capital_city });
  } else {
    res.status(404).json({ error: "State not found" });
  }
};

const getStateNickname = (req, res) => {
  const stateCode = req.params.state.toUpperCase();
  const stateData = statesData.find((state) => state.code === stateCode);

  if (stateData) {
    res.json({ state: stateData.state, nickname: stateData.nickname });
  } else {
    res.status(404).json({ error: "State not found" });
  }
};

const getStatePopulation = (req, res) => {
  const stateCode = req.params.state.toUpperCase();
  const stateData = statesData.find((state) => state.code === stateCode);

  if (stateData) {
    res.json({ state: stateData.state, population: stateData.population });
  } else {
    res.status(404).json({ error: "State not found" });
  }
};

const getStateAdmissionDate = (req, res) => {
  const stateCode = req.params.state.toUpperCase();
  const stateData = statesData.find((state) => state.code === stateCode);

  if (stateData) {
    res.json({ state: stateData.state, admitted: stateData.admission_date });
  } else {
    res.status(404).json({ error: "State not found" });
  }
};

const getRandomFunFact = async (req, res) => {
  const stateCode = req.params.state.toUpperCase();
  const stateData = statesData.find((state) => state.code === stateCode);

  try {
    const state = await State.findOne({ stateCode: stateCode });

    if (!state || !state.funfacts || state.funfacts.length === 0) {
      return res
        .status(404)
        .json({ message: `No Fun Facts found for ${stateData.state}` });
    }

    // Get a random index based on the number of fun facts
    const randomIndex = Math.floor(Math.random() * state.funfacts.length);
    // Select the fun fact at that index
    const funfact = state.funfacts[randomIndex];

    res.json({ funfact });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllStates,
  getStateData,
  getStatesByContiguity,
  getStateCapital,
  getStateNickname,
  getStatePopulation,
  getStateAdmissionDate,
  getRandomFunFact,
};
