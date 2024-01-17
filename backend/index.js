// Get the db file for run the function
const connectToMongo = require("./db");

// run the function call
connectToMongo();

// Using express js to connecting with our port
const express = require("express");
const app = express(); // configure the express to app
const port = 5000; // this port for BE
var cors = require("cors"); // importing cors
app.use(cors()); //our application need cors
app.use(express.json()); // we are passing json so we can use this

// API routing
app.use("/api/auth/", require("./routes/Auth"));
app.use("/api/add/", require("./routes/Course"));
app.use("/api/course/", require("./routes/Enrollment"));

// listening the port
app.listen(port, () => {
  console.log("App listening at the port", port);
}); // save this data and run the server
