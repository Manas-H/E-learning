// Import required modules
const express = require("express");
const dotenv = require("dotenv");
const { connectDB } = require("../config/database");
const userRoutes = require("./routes/userRoutes");
const userEnrollRoutes = require("./routes/userEnrollmentRoute");
const errorHandler = require("./middlewares/errorMiddleware");
const cors = require("cors");

const whitelist = ["https://e-learning-ui.onrender.com"];

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

// Create an Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

// Define routes
app.use("/api/user", userRoutes);
app.use("/api/course", userEnrollRoutes);

// Error handling middleware
app.use(errorHandler);

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
