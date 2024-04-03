const express = require("express");
const router = express.Router();
const {
  enrollUserInCourseController,
  getEnrolledCoursesController,
} = require("../controllers/userEnrollmentController");
const { authenticateToken } = require("../middlewares/authMiddleware");

// enroll for courses
router.post("/enroll", authenticateToken, enrollUserInCourseController);

// get courses
router.get(
  "/enrolled-courses/:userId",
  authenticateToken,
  getEnrolledCoursesController
);

module.exports = router;
