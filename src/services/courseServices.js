// services/courseService.js
const Course = require("../models/Course");

const addCourse = async ({ title, category, level, popularity }) => {
  try {
    const course = new Course({
      title,
      category,
      level,
      popularity,
    });
    const newCourse = await course.save();
    return newCourse;
  } catch (error) {
    console.log("error in services: ", error.message);
    throw new Error(error.message);
  }
};

const getCourses = async ({ category, level, popularity }) => {
  try {
    const courses = await Course.findAll({ category, level, popularity });
    return courses;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { addCourse, getCourses };
