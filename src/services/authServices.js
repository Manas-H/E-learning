const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const generateAuthToken = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

const loginUser = async ({ email, password }) => {
  try {
    const user = await User.findOneByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid credentials");
    }

    const token = generateAuthToken(user.id);
    return token;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { loginUser };
