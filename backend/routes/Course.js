const express = require("express");
const fetchuser = require("../middleware/Fetchuser");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Courses = require("../models/Courses");

//logic

router.post(
  "/courses",
  // calling middleware tp validate the token
  fetchuser,
  [
    body("name", "course name must be atleast 3 characters").isLength({
      min: 3,
    }),
    body("description", "Enter a valid desc").isLength({ min: 3 }),
    body("image", "Give valid image").isLength({ min: 3 }),
    body("category", "Enter a valid category").isLength({ min: 3 }),
    body("duration", "Enter a valid duration").isNumeric(),
    body("price", "Enter a valid price").isNumeric(),
    body("rating", "Enter a valid rating").isNumeric(),
    body("enrolledStudents", "Enter a valid enrolledstudents").isNumeric(),
  ],
  async (req, res) => {
    try {
      const {
        name,
        description,
        image,
        category,
        duration,
        price,
        rating,
        enrolledStudents,
      } = req.body;
      // console.log(req.body);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const data = new Courses({
        name,
        description,
        image,
        category,
        duration,
        price,
        rating,
        enrolledStudents,
        user: req.user.id, // getting this from middlware
      });
      const savedata = await data.save();
      res.json(savedata);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
);

// to get all the course
router.get("/fetchAllcourses", fetchuser, async (req, res) => {
  const data = await Courses.find();
  res.json(data);
});

router.delete("/deleteCourse/:id", fetchuser, async (req, res) => {
  try {
    // find the note by delete
    let course = await Courses.findById(req.params.id);
    if (!course) {
      res.status(404).send("Not Found");
    }
    course = await Courses.findByIdAndDelete(req.params.id);
    res.json(course);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
