const State = require("../models/State");
const statesData = require("../models/statesData.json");

const getAllStates = async (req, res) => {
    try {
        // Call all funfacts from mongoDB
        const funFactsData = await State.find({});

        // Convert array to a map for easy access
        const funFactsMap = new Map(
            funFactsData.map((state) => [state.stateCode, state.funfacts])
        );

        // Add fun facts to states
        const statesWithFunFacts = statesData.map((state) => {
            // if state funfact exists about state, add it. Otherwise, don't add anything.
            if (funFactsMap.get(state.code) !== undefined) {
                return {
                    ...state,
                    funfacts: funFactsMap.get(state.code),
                };
            } else {
                return { ...state };
            }
        });

        res.json(statesWithFunFacts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getStateData = async (req, res) => {
    // Get state data directly from req since it's been validated by middleware
    const { stateData } = req;

    try {
        const stateFunFacts = await State.findOne({
            stateCode: stateData.code,
        }).exec();

        if (stateFunFacts !== null) {
            return res.json({
                ...stateData,
                funfacts: stateFunFacts.funfacts,
            });
        } else {
            return res.json({ ...stateData });
        }
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
    const { stateData } = req;
    return res.json({ state: stateData.state, nickname: stateData.nickname });
};

const getStatePopulation = (req, res) => {
    const { stateData } = req;

    return res.json({
        state: stateData.state,
        population: stateData.population,
    });
};

const getStateAdmissionDate = (req, res) => {
    const { stateData } = req;

    return res.json({
        state: stateData.state,
        admitted: stateData.admission_date,
    });
};

const getRandomFunFact = async (req, res) => {
    const { stateData } = req;

    try {
        const state = await State.findOne({ stateCode: stateData.code });

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
