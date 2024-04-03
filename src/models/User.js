// models/User.js

// Import the configured sql instance
const { sql } = require("../../config/database");

class User {
  constructor({
    id,
    name,
    email,
    password,
    profilePicture = null,
    isSuperAdmin = false,
  }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.profilePicture = profilePicture;
    this.isSuperAdmin = isSuperAdmin;
  }

  async save() {
    try {
      // default everyone is user isSuperAdmin
      if (!this.isSuperAdmin) {
        this.isSuperAdmin = false;
      }
      const result = await sql`
        INSERT INTO users (name, email, password, profile_picture, issuperadmin)
        VALUES (${this.name}, ${this.email}, ${this.password}, ${
        this.profilePicture || null
      }, ${this.isSuperAdmin})
        RETURNING *
      `;
      return result[0];
    } catch (error) {
      throw new Error("Error saving user to the database");
    }
  }

  static async findOneByEmail(email) {
    try {
      const result = await sql`
        SELECT * FROM users WHERE email = ${email}
      `;
      return result[0]; // Assuming email is unique, return the first user found
    } catch (error) {
      throw new Error("Error finding user by email");
    }
  }

  static async findById(userId) {
    try {
      const result = await sql`
        SELECT * FROM users WHERE id = ${userId}
      `;
      return result[0]; // Assuming user ID is unique, return the first user found
    } catch (error) {
      throw new Error("Error finding user by ID");
    }
  }
}

module.exports = User;
