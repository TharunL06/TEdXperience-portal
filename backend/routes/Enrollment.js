// Importing necessary modules and dependencies
const express = require("express");
const fetchuser = require("../middleware/Fetchuser");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Enroll = require("../models/Enroll");

// POST endpoint for enrolling in a course
router.post(
  "/enroll",
  // Middleware to validate the user's token and fetch user details
  fetchuser,
  [
    // Validation checks for request body parameters using express-validator
    body("courseId", "course name must be at least 3 characters...").isLength({
      min: 3,
    }),
    body("paymentId", "Enter a valid payment Id").isLength({ min: 5 }),
    body("Address", "Enter a valid address").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      // Destructuring relevant data from the request body
      const { courseId, paymentId, Address } = req.body;

      // Validating request body parameters using express-validator
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Creating a new enrollment instance with user details
      const data = new Enroll({
        courseId,
        paymentId,
        Address,
        user: req.user.id, // Assuming fetchuser middleware sets user details in req.user
      });

      // Checking if the user is already enrolled in the given course
      let courseIds = await Enroll.findOne({ courseId: req.body.courseId });
      let user_ID = await Enroll.findOne({ user: req.user.id });

      try {
        if (courseIds && user_ID) {
          // User is already enrolled in the course
          return res.status(400).json({
            error: "Enrolled Already with the course",
          });
        }

        // Saving the enrollment data to the database
        const saveData = await data.save();
        res.json(saveData);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
      }
    } catch (error) {
      // Handling any unexpected errors
      console.log(error);
    }
  }
);

// fetching enrollments
router.get("/fetchAllEnrollment",fetchuser,async(req,res)=>{
  const data = await Enroll.find({user:req.user.id})
  res.json(data)
})

// Exporting the router for use in other parts of the application
module.exports = router;
