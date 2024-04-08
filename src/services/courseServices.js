// services/courseService.js
const Course = require("../models/Course");
const { sql } = require("../../config/database");

const addCourse = async ({ title, category, level, popularity }) => {
  try {
    // Check if a course with the same details already exists
    const existingCourse = await Course.findDuplicateCourse(
      title,
      category,
      level,
      popularity
    );

    if (existingCourse) {
      // If a course with the same details exists
      throw new Error("Course already exists");
    }

    // If no course with the same details exists, create and save the new course
    const newCourse = new Course({
      title,
      category,
      level,
      popularity,
    });
    await newCourse.save();
    return newCourse;
  } catch (error) {
    console.error("Error in services:", error.message);
    throw new Error(error.message);
  }
};

const getCourses = async ({ category, level, popularity, page = 1 }) => {
  try {
    const courses = await Course.findAll({ category, level, popularity, page });
    return courses;
  } catch (error) {
    throw new Error(error.message);
  }
};

// read databy id
const getCourseById = async (id) => {
  try {
    const course = await Course.findById(id);
    console.log("get couse by id: ", course);
    if (!course) {
      throw new Error("Course not found");
    }
    return course;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateCourse = async (courseId, updatedCourseInfo) => {
  try {
    // Fetch the original course data from the database
    const originalCourse =
      await sql`SELECT * FROM courses WHERE id = ${courseId}`;
    const originalCourseData = originalCourse[0];

    // Extract updated course data
    const { title, category, level, popularity } = updatedCourseInfo.course;

    console.log("Updating Course with ID:", courseId); // Log courseId
    console.log("Updated Course Info:", updatedCourseInfo); // Log updatedCourseInfo

    // Construct and execute SQL queries for fields that have changed
    if (title && title !== originalCourseData.title) {
      await sql`UPDATE courses SET title = ${title} WHERE id = ${courseId}`;
      console.log("Title updated successfully");
    }
    if (category && category !== originalCourseData.category) {
      await sql`UPDATE courses SET category = ${category} WHERE id = ${courseId}`;
      console.log("Category updated successfully");
    }
    if (level && level !== originalCourseData.level) {
      await sql`UPDATE courses SET level = ${level} WHERE id = ${courseId}`;
      console.log("Level updated successfully");
    }
    if (
      popularity !== undefined &&
      popularity !== originalCourseData.popularity
    ) {
      // console.log("Updating Popularity to:", popularity);
      await sql`UPDATE courses SET popularity = ${popularity} WHERE id = ${courseId}`;
      // console.log("Popularity updated successfully");
    }

    // Fetch updated course information
    const result = await sql`SELECT * FROM courses WHERE id = ${courseId}`;
    // console.log("Updated Course:", result[0]);

    // Check if any rows were affected
    if (result.length === 0) {
      throw new Error("Course not found");
    }

    // Return the updated course information
    return result[0];
  } catch (error) {
    console.error("Error updating course:", error.message); // Log error message
    throw new Error(error.message);
  }
};

const deleteCourse = async (courseId) => {
  try {
    const result = await Course.deleteById(courseId);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  addCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
