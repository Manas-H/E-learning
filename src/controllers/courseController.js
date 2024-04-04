// controllers/courseController.js

const {
  addCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../services/courseServices");

// controller to create a course only for super admin
const createCourse = async (req, res) => {
  try {
    const { title, category, level, popularity } = req.body;
    const newCourse = await addCourse({ title, category, level, popularity });
    res.status(201).json({ course: newCourse });
  } catch (error) {
    // Log error for debugging
    console.log("Error in createCourse controller: ", error.message);

    res.status(500).json({ message: "Failed to create course." });
  }
};

// Controller to get a list of courses based on filters
const getCoursesList = async (req, res) => {
  try {
    const { category, level, popularity } = req.query;
    const courses = await getCourses({ category, level, popularity });
    res.json({ courses });
  } catch (error) {
    console.log("Get Course List Controller: ", error.message);
    res.status(500).json({ message: "Failed to fetch courses." });
  }
};

// Controller to get a single course by ID
const getCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await getCourseById(courseId);

    if (!course) {
      // If course not found, send 404 Not Found
      return res.status(404).json({ message: "Course not found." });
    }

    res.json({ course });
  } catch (error) {
    console.log("Error in Getting Courses: ", error.message);
    res.status(500).json({ message: "Failed to fetch course details." });
  }
};

// Controller to update course details
const updateCourseDetails = async (req, res) => {
  try {
    const courseId = req.params.id;
    const updatedCourseInfo = req.body;
    const updatedCourse = await updateCourse(courseId, updatedCourseInfo);
    res.json({ course: updatedCourse });
  } catch (error) {
    console.log("Error in Updating course detail: ", error.message);
    res.status(500).json({ message: "Failed to update course details." });
  }
};

// Controller to remove a course
const removeCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const result = await deleteCourse(courseId);
    res.json({ message: result });
  } catch (error) {
    console.log("Error deletin course: ", error.message);
    res.status(500).json({ message: "Failed to delete course." });
  }
};

module.exports = {
  createCourse,
  getCoursesList,
  getCourse,
  updateCourseDetails,
  removeCourse,
};
