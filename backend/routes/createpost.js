// Import the Express framework
const express = require("express");

// Create a new router object using Express Router
const router = express.Router();

// Import Mongoose to interact with MongoDB
const mongoose = require("mongoose");

// Import custom middleware to check if the user is logged in before accessing routes
const requireLogin = require("../middlewares/requireLogin");

// (Unnecessary line) Importing 'route' from 'auth.js' — this is likely unused and can be removed
const { route } = require("./auth");

// Get the POST model from Mongoose (assumes it's already registered with mongoose.model)
const POST = mongoose.model("POST");
