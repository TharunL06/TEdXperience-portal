const mongoose = require("mongoose");
const mongoURI = "mongodb://localhost:27017/tedx-portal"; // took the url from mongocompass

// Making connection , After made the connection display some message
const connectToMongo = () =>
  mongoose
    .connect(mongoURI)
    .then(() => console.log("Tharun ! Your Database is connected  "));

// exporting this function
module.exports = connectToMongo;

// this is database connection