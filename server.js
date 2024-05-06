require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const connectDB = require("./config/dbConn");
const PORT = process.env.PORT || 3500;

connectDB();

// Enable CORS for all routes
app.use(cors());

// Middleware for json
app.use(express.json());

// Define a route for the root URL
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use("/states", require("./routes/states"));

mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
