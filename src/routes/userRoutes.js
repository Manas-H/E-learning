//userRoutes.js

const express = require("express");
const router = express.Router();
const {
  register,
  viewProfile,
  updateProfile,
  login,
  upload,
} = require("../controllers/userController");
const {
  getCoursesList,
  createCourse,
} = require("../controllers/courseController");
const {
  authenticateToken,
  isSuperAdminMiddleware,
} = require("../middlewares/authMiddleware");

// Route for user registration
router.post("/register", register);

// Route for user login
router.post("/login", login);

// View user profile route
router.get("/profile", authenticateToken, viewProfile);

// Update user profile route
router.put(
  "/profile/update",
  authenticateToken,
  upload.single("profilePicture"),
  updateProfile
);
router.post(
  "/courses",
  authenticateToken,
  isSuperAdminMiddleware,
  createCourse
);

// Get Courses route - protected by authentication middleware
router.get("/courses", authenticateToken, getCoursesList);

module.exports = router;
