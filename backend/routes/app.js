// Import required modules
const express = require('express'); // Express is used to build the REST API server
const app = express(); // Initialize the Express application
const port = 5000; // Define the port the server will run on
const mongoose = require("mongoose"); // Mongoose is used to connect and work with MongoDB
const { mongoUrl } = require("./keys"); // Import MongoDB connection string from keys.js
const cors = require("cors"); // CORS allows requests from different origins (used for frontend-backend communication)

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Load Mongoose models
require('./models/model'); // Load user model
require('./models/post');  // Load post model

// Middleware to parse incoming JSON requests
app.use(express.json());

// Import and use route files
app.use(require("./routes/auth"));       // Routes for user authentication (login/register)
app.use(require("./routes/createPost")); // Routes for creating, reading, deleting posts
app.use(require("./routes/user"));       // Routes related to user information/actions

// Connect to MongoDB using mongoose
mongoose.connect(mongoUrl);

// Listen for successful MongoDB connection
mongoose.connection.on("connected", () => {
    console.log("Successfully connected to MongoDB");
});

// Listen for MongoDB connection errors
mongoose.connection.on("error", () => {
    console.log("Not connected to MongoDB");
});

// Start the Express server and listen on the defined port
app.listen(port, () => {
    console.log("Server is running on port " + port);
});
