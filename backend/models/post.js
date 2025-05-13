// Import mongoose for MongoDB interactions
const mongoose = require("mongoose");

// Destructure ObjectId type from mongoose.Schema.Types to reference other documents
const { ObjectId } = mongoose.Schema.Types;

// Define the schema for a post
const postSchema = new mongoose.Schema({

    // 'body' stores the text content of the post
    body: {
        type: String,
        required: true // This field is required
    },

    // 'photo' stores the URL or path of the image associated with the post
    photo: {
        type: String,
        require: true // Typo: should be 'required' instead of 'require'
    },

    // 'likes' is an array of ObjectIds referencing users who liked the post
    likes: [{ 
        type: ObjectId, 
        ref: "USER" // Reference to the USER model
    }],

    // 'comments' is an array of objects containing the comment text and the user who posted it
    comments: [{
        comment: { type: String }, // The comment text
        postedBy: { 
            type: ObjectId, 
            ref: "USER" // The user who made the comment
        }
    }],

    // 'postedBy' stores the user who created the post
    postedBy: {
        type: ObjectId,
        ref: "USER" // Reference to the USER model
    }

}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Register the model with the name "POST"
mongoose.model("POST", postSchema);
