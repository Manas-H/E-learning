// controllers/userController.js

const {
  registerUser,
  getUserById,
  updateUserProfile,
} = require("../services/userServices");
const { loginUser } = require("../services/authServices");
const { uploadProfilePicture } = require("../services/cloudinaryServices");
const multer = require("multer");
const path = require("path");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await registerUser({ name, email, password });
    console.log("try block of user ser");
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
    // console.log("catch block of user ser");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await loginUser({ email, password });
    res.json({ token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const viewProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from the authenticated user
    const user = await getUserById(userId);
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    const userId = req.user.id; // Extract user ID from the authenticated user
    const { name, email } = req.body; // Extract updated information from request body
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
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, viewProfile, updateProfile, upload };
