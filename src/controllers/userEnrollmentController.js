const {
  enrollUserInCourse,
  getEnrolledCourses,
} = require("../services/userEnrollmentService");

const enrollUserInCourseController = async (req, res) => {
  const userId = req.user.id; // Extract user ID from the request object

  const { courseId } = req.body;

  try {
    const results = await enrollUserInCourse(userId, courseId);

    if (!results.success) {
      // Return the custom error message
      return res.status(400).json({ error: results.message });
    }

    res.status(200).json({ message: "User enrolled in course successfully" });
  } catch (error) {
    console.error("Error enrolling user in course:", error.message);
    res.status(500).json({ error: "Failed to enroll user in course" });
  }
};

const getEnrolledCoursesController = async (req, res) => {
  const userId = req.user.id; // Extract user ID from the request object

  try {
    const enrolledCourses = await getEnrolledCourses(userId);
    res.status(200).json({ enrolledCourses });
  } catch (error) {
    console.error("Error fetching enrolled courses:", error.message);
    console.log(error);
    res.status(500).json({ error: "Failed to fetch enrolled courses" });
  }
};

module.exports = { enrollUserInCourseController, getEnrolledCoursesController };
