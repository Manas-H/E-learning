// middleware/authMiddleware.js

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden - Invalid token" });
    }
    req.user = user;
    next();
  });
};

const isSuperAdminMiddleware = (req, res, next) => {
  console.log(req.user);
  console.log(req.user.issuperadmin);
  // Check if the user is logged in and is a superadmin
  if (!req.user || !req.user.issuperadmin) {
    return res
      .status(403)
      .json({ message: "Forbidden - Only superadmins can create courses" });
  }

  next();
};

module.exports = { authenticateToken, isSuperAdminMiddleware };
