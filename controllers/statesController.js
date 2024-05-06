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
        population: stateData.population.toLocaleString("en-US"),
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

const addFunFacts = async (req, res) => {
    const stateCode = req.stateData.code;
    const newFunFacts = req.body?.funfacts;

    if (typeof newFunFacts === "undefined") {
        return res
            .status(400)
            .json({ message: "State fun facts value required" });
    } else if (!Array.isArray(newFunFacts)) {
        return res
            .status(400)
            .json({ message: "State fun facts value must be an array" });
    }

    try {
        // Find the state document or create a new one if it doesn't exist
        const state = await State.findOneAndUpdate(
            { stateCode },
            { $push: { funfacts: { $each: newFunFacts } } }, // Use $push with $each to add all new fun facts
            { new: true, upsert: true } // options to return the updated document and create if not exists
        );

        // Return state data with 200 if no new fun facts added, otherwise 201
        newFunFacts.length === 0
            ? res.status(200).json(state)
            : res.status(201).json(state);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateFunFact = async (req, res) => {
    const { index, funfact } = req.body;
    const stateCode = req.stateData.code;

    // Check if index is provided + is a number/string number + greater than 0
    if (index === undefined) {
        return res
            .status(400)
            .json({ message: "State fun fact index value required" });
    } else if (isNaN(index) || index < 1) {
        return res.status(400).json({
            message: `No Fun Fact found at that index for ${req.stateData.state}`,
        });
    }

    // Convert boolean and number to string if necessary
    let funfactStr = funfact;
    if (typeof funfact === "boolean" || typeof funfact === "number") {
        funfactStr = funfact.toString();
    }

    // Check if funfact is null or undefined, or an empty string
    if (funfactStr == null || funfactStr === "") {
        return res.status(400).json({ message: "Valid funfact required." });
    }

    try {
        // Adjust index to be zero-based for the array
        const arrayIndex = index - 1;

        // Check if the state has any funfacts
        const state = await State.findOne({ stateCode: stateCode });
        if (!state || state.funfacts.length === 0) {
            return res.status(404).json({
                message: `No Fun Facts found for ${req.stateData.state}`,
            });
        }

        // Check if the index is within bounds
        if (arrayIndex >= state.funfacts.length || arrayIndex < 0) {
            return res.status(400).json({
                message: `No Fun Fact found at that index for ${req.stateData.state}`,
            });
        }

        // Update the fun fact at the specific index
        state.funfacts[arrayIndex] = funfact;

        // Save the updated state document
        await state.save();

        res.status(200).json(state);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteFunFact = async (req, res) => {
    const { index } = req.body;
    const stateCode = req.stateData.code;

    // Check if index is provided + is a number/string number + greater than 0
    if (index === undefined) {
        return res
            .status(400)
            .json({ message: "State fun fact index value required" });
    } else if (isNaN(index) || index < 1) {
        return res.status(400).json({
            message: `No Fun Fact found at that index for ${req.stateData.state}`,
        });
    }

    try {
        // Adjust parsedIndex to be zero-based for the array
        const arrayIndex = index - 1;

        // Check if the state has any funfacts
        const state = await State.findOne({ stateCode: stateCode });
        if (!state || state.funfacts.length === 0) {
            return res.status(404).json({
                message: `No Fun Facts found for ${req.stateData.state}`,
            });
        }

        // Check if the index is within bounds
        if (arrayIndex >= state.funfacts.length || arrayIndex < 0) {
            return res.status(400).json({
                message: `No Fun Fact found at that index for ${req.stateData.state}`,
            });
        }

        // Remove the fun fact at the specific index
        state.funfacts.splice(arrayIndex, 1);

        // Save the updated state document
        await state.save();

        res.status(200).json(state);
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
    addFunFacts,
    updateFunFact,
    deleteFunFact,
};
