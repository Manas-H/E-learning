// controllers/userController.js

const {
  registerUser,
  getUserById,
  updateUserProfile,
  deleteUser,
  updateUserPassword,
} = require("../services/userServices");
const { loginUser } = require("../services/authServices");
const { uploadProfilePicture } = require("../services/cloudinaryServices");
const multer = require("multer");
const path = require("path");

// Register new User
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await registerUser({ name, email, password });
    // console.log("try block of user ser");
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.log("Error Registering : ", error.message);
    res.status(500).json({ message: "Failed to register user" });
    // console.log("catch block of user ser");
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await loginUser({ email, password });
    res.json({ token });
  } catch (error) {
    res
      .status(401)
      .json({ message: error.message || "Invalid email or password" });
  }
};

const viewProfile = async (req, res) => {
  try {
    // Extract user ID from the authenticated user
    const userId = req.user.id;
    const user = await getUserById(userId);
    if (!user) {
      // If user not found, send 404 Not Found
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Failed to fetch user profile" });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public"));
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
// console.log("this is mutler :", multer);

const upload = multer({ storage: storage });
// console.log("this is upload: ", upload);

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;
    let profilePicture;
    // console.log("this is req file : ", req.file);

    if (req.file) {
      const imagePath = req.file.path;
      // console.log("this is img path :", imagePath);
      const result = await uploadProfilePicture(imagePath);
      // console.log("this is results :", result);
      profilePicture = result;
      // console.log("this is profilePic :", profilePicture);
    }

    await updateUserProfile(userId, { name, email, profilePicture });
    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Failed to update user profile" });
  }
};

const removeUser = async (req, res) => {
  try {
    const courseId = req.params.id;
    const result = await deleteUser(courseId);
    res.json({ message: result });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to delete user" });
  }
};

const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("controllder password", req.user.id);
    console.log("controllder password1", userId);
    const { oldPassword, newPassword } = req.body;
    const message = await updateUserPassword(userId, oldPassword, newPassword);

    // Password updated successfully
    res.status(200).json({ message });
  } catch (error) {
    // Handling specific error messages with appropriate status codes
    if (error.message === "User not found") {
      res.status(404).json({ error: "User not found" });
    } else if (error.message === "Old password is incorrect") {
      res.status(400).json({ error: "Old password is incorrect" });
    } else if (
      error.message === "New password must be different from the old password"
    ) {
      res.status(400).json({
        error: "New password must be different from the old password",
      });
    } else {
      res.status(500).json({ error: "Error updating password" });
    }
  }
};

module.exports = {
  register,
  login,
  viewProfile,
  updateProfile,
  removeUser,
  updatePassword,
  upload,
};
