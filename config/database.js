// database.js

const postgres = require("postgres");
require("dotenv").config();

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: "require",
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
});

const connectDB = async () => {
  try {
    // Test the connection by querying the version of PostgreSQL
    const result = await sql`select version()`;
    console.log("Connected to PostgreSQL database:", result);
  } catch (error) {
    console.error("Failed to connect to PostgreSQL database:", error);
    process.exit(1); // Exit the application if unable to connect to the database
  }
};

module.exports = { sql, connectDB };
