// Importing the mongoose library
const mongoose = require("mongoose");

// Destructuring the Schema object from mongoose
const { Schema } = mongoose;

// Creating a new mongoose schema for enrollment
const EnrollSchema = new Schema({
  // Reference to the user for whom the enrollment is made
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // Assuming there is a 'user' model to refer to
  },

  // Course ID for the enrollment, with specified constraints
  courseId: { type: String, trim: true, required: true, maxlength: 1000 },

  // Payment ID associated with the enrollment, with specified constraints
  paymentId: { type: String, trim: true, required: true, maxlength: 2000 },

  // Address information for the enrollment, with specified constraints
  Address: { type: String, required: true, maxlength: 2000 },

  // Date of the enrollment, defaulting to the current date
  date: { type: Date, default: Date.now },
});

// Exporting the mongoose model for 'enrolments' using the defined schema
module.exports = mongoose.model("enrolments", EnrollSchema);
