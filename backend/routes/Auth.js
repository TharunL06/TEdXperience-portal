const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User"); // Import the User model that defines the user schema
const router = express.Router(); // Create an instance of the Express router
const bcrypt = require("bcrypt"); // Import the bcrypt library for password hashing
const JWT_SECRET = "tedxlearning$"; // Define a secret key for JWT (JSON Web Token) signing
var jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/Fetchuser");

// Define a route for creating a new user
router.post(
  "/createUser",
  [
    // Express-validator middleware for request validation
    body("name", "Enter a valid name").isLength({ min: 3 }), // Validate the length of the name (minimum 3 characters)
    body("email", "Enter a valid email").isEmail(), // Validate the email format
    body("password", "Enter a valid password").isLength({ min: 6 }), // Validate the length of the password (minimum 6 characters)
    body("mobile", "Enter a valid mobile number").isLength({ min: 10 }), // Validate the length of the mobile number (minimum 10 characters)
  ],
  async (req, res) => {
    try {
      let success = false;
      const errors = validationResult(req); // Validate the request using express-validator

      if (!errors.isEmpty()) {
        // If there are validation errors, return a 400 Bad Request with the errors
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if the email or mobile number is already taken
      let userEmail = await User.findOne({ email: req.body.email }); // Check if the email already exists in the database
      let userMobile = await User.findOne({ mobile: req.body.mobile }); // Check if the mobile number already exists in the database

      if (userEmail || userMobile) {
        // If the email or mobile is already taken, return a 400 Bad Request with an error message
        return res.status(400).json({
          success: success,
          error: "Email or mobile number already taken",
        });
      }

      // Hash the user's password using bcrypt
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(req.body.password, salt);

      // Create a new user and store them in the database
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
        mobile: req.body.mobile,
        isAdmin: req.body.isAdmin, // for admin
      });

      // Data to send back to the client after successful user creation
      const data = {
        user: {
          id: user.id,
          name: user.name,
          isAdmin: user.isAdmin,
        },
      };

      let name = data.user.name;
      let isAdmin = data.user.isAdmin;
      const authToken = jwt.sign(data, JWT_SECRET); // Create a JWT token for specific data
      success = true;

      res.json({ authToken, success, name, isAdmin });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
);

// Login API route and set the endpoint
router.post(
  "/loginUser",
  [
    // Express-validator middleware for request validation
    body("email", "Enter a valid email").isEmail(), // Validate the email format
    body("password", "Enter a valid password").exists(), // Validate the length of the password (minimum 6 characters)
  ],

  async (req, res) => {
    let success = false;
    const errors = validationResult(req); // Validate the request using express-validator
    if (!errors.isEmpty()) {
      // If there are validation errors, return a 400 Bad Request with the errors
      return res.status(400).json({ success, errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        // if not user return response
        return res
          .status(400)
          .json({ error: "No User with this Email exists" });
      } // If this condition become false goes password
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ error: "Incorrect Password" });
      }
      // Storing specific data into a payload
      const payload = {
        user: {
          id: user.id,
          name: user.name,
          isAdmin: user.isAdmin
        },
      };
      success = true;
      let name = payload.user.name;
      let isAdmin = payload.user.isAdmin;
      
      // console.log(payload)
      const authToken = jwt.sign(payload, JWT_SECRET);
      res.json({ authToken, success, name, isAdmin });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
);

// fetching specific user
router.get(
  "/getUser",fetchuser, async(req,res)=>{
    try{
      userId = req.user.id
      const user = await User.findById(userId).select("-password")
      res.send(user)
    }
    catch(error){
      console.log(error)
      res.status(500).send("Internal server error")
    }
  }
)

// Export the router for use in other parts of the application

module.exports = router;
