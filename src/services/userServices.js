// services/userService.js

const User = require("../models/User");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { PostgresError } = require("postgres");
const { sql } = require("../../config/database");
const { sendEmail } = require("../../config/email");

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
    console.log("this email type: ", typeof email);
    console.log("this email type: ", email);

    await sendEmail(
      "Registration confirmation",
      "<strong>Thank you for registering with us!</strong>"
    );
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
    console.error(error.message);
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

    console.log("Updated Info:", updatedInfo);

    if (name) {
      await sql`UPDATE users SET name = ${name} WHERE id = ${userId}`;
    }
    if (email) {
      await sql`UPDATE users SET email = ${email} WHERE id = ${userId}`;
    }
    if (profilePicture) {
      console.log("Profile Picture:", profilePicture);
      await sql`UPDATE users SET profile_picture = ${profilePicture} WHERE id = ${userId}`;
    }

    const result = await sql`SELECT * FROM users WHERE id = ${userId}`;

    // Check if any rows were affected
    if (result.length === 0) {
      throw new Error("User not found");
    }

    console.log("Updated User:", result[0]);

    return result[0];
  } catch (error) {
    console.error("Error:", error.message);
    throw new Error(error.message);
  }
};

const updateUserPassword = async (userId, oldPassword, newPassword) => {
  try {
    console.log("User ID:", userId);
    // Retrieve the user's hashed password from the database
    const result = await sql`
      SELECT password FROM users WHERE id = ${userId}
    `;
    const userPassword = result && result[0] && result[0].password;

    if (!userPassword) {
      throw new Error("User not found");
    }

    // Compare the old password with the hashed password retrieved from the database
    const isPasswordMatch = await bcrypt.compare(oldPassword, userPassword);
    if (!isPasswordMatch) {
      throw new Error("Old password is incorrect");
    }

    // Validate the new password
    if (
      !validator.isStrongPassword(newPassword, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      throw new Error(
        "New password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character"
      );
    }

    // Ensure the new password is different from the old one
    if (oldPassword === newPassword) {
      throw new Error("New password must be different from the old password");
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await sql`
      UPDATE users
      SET password = ${hashedNewPassword}
      WHERE id = ${userId}
    `;

    // Get the user's email from the database
    const user = await sql`
      SELECT email FROM users WHERE id = ${userId}
    `;
    const userEmail = user && user[0] && user[0].email;

    // Send email notification about password change
    if (userEmail) {
      await sendEmail(
        "Password Changed",
        "<strong>Your password has been successfully changed.</strong>"
      );
    }

    return "Password updated successfully";
  } catch (error) {
    console.error("Error updating password:", error.message);
    throw new Error(error.message);
  }
};

const deleteUser = async (userId) => {
  try {
    const result = await sql`
      DELETE FROM users WHERE id = ${userId}
    `;
    if (result.rowCount === 0) {
      throw new Error("User not found");
    }
    return "User deleted successfully";
  } catch (error) {
    console.error("model error: ", error.message);
    throw new Error("Error deleting user from the database");
  }
};

module.exports = {
  registerUser,
  getUserById,
  updateUserProfile,
  deleteUser,
  updateUserPassword,
};
