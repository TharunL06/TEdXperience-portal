const mongoose = require("mongoose");
const { Schema } = mongoose;
// creating schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  isAdmin:{
    type:Boolean,default:false
  },
  date: {
    type: Date,
    default: Date.now,
  }, // date is for when the user create this
});

// whenever we create the schema need to export that
module.exports = mongoose.model("users", UserSchema);

