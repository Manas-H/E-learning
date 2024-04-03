// services/userService.js

const User = require("../models/User");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { PostgresError } = require("postgres");
const { sql } = require("../../config/database");
const { uploadProfilePicture } = require("../services/cloudinaryServices");
// const config = require('../../config/config');
// const { sendEmail } = require('../../config/email');

const registerUser = async ({ name, email, password, profilePicture }) => {
  try {
    // Validate name
    if (!validator.isAlpha(name.replace(/\s/g, ""))) {
      throw new Error("Name must contain only letters");
    }

    // Validate email
    if (!validator.isEmail(email)) {
      throw new Error("Invalid email format");
    }

    // Validate password
    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      throw new Error(
        "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character"
      );
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user with the same email already exists
    const existingUser = await User.findOneByEmail(email);
    if (existingUser) {
      throw new Error("Email address is already in use");
    }

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      profilePicture,
    });
    // Save user to database
    const newUser = await user.save();
    return newUser;
  } catch (error) {
    if (
      error instanceof PostgresError &&
      error.code === "23505" &&
      error.constraint_name === "users_email_key"
    ) {
      // Duplicate email error
      throw new Error("Email address is already in use");
    }
    throw new Error(error.message);
  }
};

const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateUserProfile = async (userId, updatedInfo) => {
  try {
    const { name, email, profilePicture } = updatedInfo;

    console.log("Updated Info:", updatedInfo); // Log the updated info

    if (name) {
      await sql`UPDATE users SET name = ${name} WHERE id = ${userId}`;
    }
    if (email) {
      await sql`UPDATE users SET email = ${email} WHERE id = ${userId}`;
    }
    if (profilePicture) {
      console.log("Profile Picture:", profilePicture); // Log the profile picture URL
      await sql`UPDATE users SET profile_picture = ${profilePicture} WHERE id = ${userId}`;
    }

    const result = await sql`SELECT * FROM users WHERE id = ${userId}`;

    // Check if any rows were affected
    if (result.length === 0) {
      throw new Error("User not found");
    }

    console.log("Updated User:", result[0]); // Log the updated user

    // Return the updated user information
    return result[0];
  } catch (error) {
    console.error("Error:", error.message); // Log any errors
    throw new Error(error.message);
  }
};

module.exports = { registerUser, getUserById, updateUserProfile };
