require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const connectDB = require("./config/dbConn");
const PORT = process.env.PORT || 3500;
