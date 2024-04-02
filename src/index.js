// Import required modules
const express = require('express');
const dotenv = require('dotenv');
const { connectDB } = require('../config/database');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middlewares/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

// Create an Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Define routes
app.use('/api/user', userRoutes);

// Error handling middleware
app.use(errorHandler);

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
