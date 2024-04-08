// errorMiddleware.js

const errorHandler = (err, req, res, next) => {
  // Log the error for debugging purposes
  console.error(err.stack);

  // Check if the error is a custom error with a status code
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Send error response to the client
  res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;
