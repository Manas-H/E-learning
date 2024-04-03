// controllers/courseController.js

const {
  addCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../services/courseServices");

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

const getCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await getCourseById(courseId);
    res.json({ course });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updateCourseDetails = async (req, res) => {
  try {
    const courseId = req.params.id;
    const updatedCourseInfo = req.body;
    const updatedCourse = await updateCourse(courseId, updatedCourseInfo);
    res.json({ course: updatedCourse });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const result = await deleteCourse(courseId);
    res.json({ message: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCourse,
  getCoursesList,
  getCourse,
  updateCourseDetails,
  removeCourse,
};
