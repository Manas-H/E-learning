// controllers/courseController.js

const { getCourses, addCourse } = require("../services/courseServices");

const createCourse = async (req, res) => {
  try {
    const { title, category, level, popularity } = req.body;
    const newCourse = await addCourse({ title, category, level, popularity });
    res.status(201).json({ course: newCourse });
  } catch (error) {
    console.log("error in controllder: ", error.message);
    res.status(500).json({ message: error.message });
  }
};

const getCoursesList = async (req, res) => {
  try {
    const { category, level, popularity } = req.query;
    const courses = await getCourses({ category, level, popularity });
    res.json({ courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createCourse, getCoursesList };
