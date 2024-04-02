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
  static async findAll({ category, level, popularity }) {
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

      const result = await sql.unsafe(query);
      return result;
    } catch (error) {
      console.error("model error: ", error.message);
      throw new Error("Error fetching courses from the database");
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
