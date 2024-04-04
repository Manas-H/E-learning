//userRoutes.js

const express = require("express");
const router = express.Router();
const {
  register,
  viewProfile,
  updateProfile,
  login,
  removeUser,
  updatePassword,
  upload,
} = require("../controllers/userController");
const {
  getCoursesList,
  createCourse,
  getCourse,
  removeCourse,
  updateCourseDetails,
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

router.put("/update-password", authenticateToken, updatePassword);

router.delete("/:id", authenticateToken, isSuperAdminMiddleware, removeUser);

// Get Courses route - protected by authentication middleware
router.get("/courses", authenticateToken, getCoursesList);

router.post(
  "/courses",
  authenticateToken,
  isSuperAdminMiddleware,
  createCourse
);

// Route to get a course by ID
router.get(
  "/courses/:id",
  authenticateToken,
  isSuperAdminMiddleware,
  getCourse
);

// Route to update course details by ID
router.put(
  "/courses/:id",
  authenticateToken,
  isSuperAdminMiddleware,
  updateCourseDetails
);

// Route to delete a course by ID
router.delete(
  "/courses/:id",
  authenticateToken,
  isSuperAdminMiddleware,
  removeCourse
);

module.exports = router;
