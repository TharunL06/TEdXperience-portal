const mongoose = require("mongoose"); // Importing mongoose for connecting
const { Schema } = mongoose;

// Define a specific schema for the Course model
const CourseSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // Reference to the User model, representing the admin
  },
  name: {
    type: String,
    trim: true,
    required: true,
    maxlength: 1000,
  },
  description: {
    type: String,
    trim: true,
    required: true,
    maxlength: 5000,
  },
  image: {
    type: String,
    trim: true,
    required: true,
    maxlength: 1000,
  },
  category: {
    type: String,
    trim: true,
    required: true,
    maxlength: 200,
  },
  duration: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  enrolledStudents: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the Course model based on the defined schema
module.exports = mongoose.model("courses", CourseSchema);
