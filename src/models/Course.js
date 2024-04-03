// models/Course.js

const { sql } = require("../../config/database");

class Course {
  constructor({ id, title, category, level, popularity }) {
    this.id = id;
    this.title = title;
    this.category = category;
    this.level = level;
    this.popularity = popularity;
    // this.description = description;
  }

  async save() {
    try {
      const result = await sql`
        INSERT INTO courses (title, category, level, popularity)
        VALUES (${this.title}, ${this.category}, ${this.level}, ${this.popularity})
        RETURNING *
      `;
      return result[0];
    } catch (error) {
      console.error("model error: ", error.message);
      throw new Error("Error saving user to the database");
    }
  }

  // Method to fetch courses with filtering options
  static async findAll({ category, level, popularity, page = 1, limit = 10 }) {
    try {
      let query = `SELECT * FROM courses`;

      if (category || level || popularity) {
        query += ` WHERE`;

        if (category) {
          query += ` category = '${category}'`; // Wrap category value in single quotes
        }

        if (level) {
          query += ` ${category ? "AND" : ""} level = '${level}'`; // Wrap level value in single quotes
        }

        if (popularity) {
          query += ` ${
            category || level ? "AND" : ""
          } popularity = ${popularity}`;
        }
      }

      // Count total number of courses
      const countQuery = `SELECT COUNT(*) AS total FROM courses`;
      const countResult = await sql.unsafe(countQuery);
      const total = countResult[0].total;

      // Add pagination
      const offset = (page - 1) * limit;
      query += ` LIMIT ${limit} OFFSET ${offset}`;

      const result = await sql.unsafe(query);

      // Calculate total number of pages
      const totalPages = Math.ceil(total / limit);

      // Determine if there are more pages
      const hasNextPage = page < totalPages;

      // Construct metadata object
      const metadata = {
        total,
        totalPages,
        hasNextPage,
      };

      return { result, metadata };
    } catch (error) {
      console.error("model error: ", error.message);
      throw new Error("Error fetching courses from the database");
    }
  }

  // to find by couse id
  static async findById(courseId) {
    try {
      const result = await sql`
        SELECT * FROM courses WHERE id = ${courseId}
      `;
      return result[0];
    } catch (error) {
      console.error("model error: ", error.message);
      throw new Error("Error fetching course by ID from the database");
    }
  }

  // to delte the course
  static async delete() {
    try {
      await sql`
        DELETE FROM courses WHERE id = ${this.id}
      `;
    } catch (error) {
      console.error("model error: ", error);
      throw new Error("Error deleting course from the database");
    }
  }

  static async deleteById(courseId) {
    try {
      const result = await sql`
        DELETE FROM courses WHERE id = ${courseId}
      `;
      if (result.rowCount === 0) {
        throw new Error("Course not found");
      }
      return "Course deleted successfully";
    } catch (error) {
      console.error("model error: ", error.message);
      throw new Error("Error deleting course from the database");
    }
  }

  static async findAll1(sql, { limit = 10, offset = 0, category, level }) {
    // <-- Pass 'sql' instance to 'findAll' method
    let query = sql`
      SELECT * FROM courses
      ORDER BY popularity DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    if (category) {
      query = sql`
        SELECT * FROM courses
        WHERE category = ${category}
        ORDER BY popularity DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

    if (level) {
      query = sql`
        SELECT * FROM courses
        WHERE level = ${level}
        ORDER BY popularity DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

    const courses = await query;
    return courses;
  }
}

module.exports = Course;
