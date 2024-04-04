const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const generateAuthToken = (userId, issuperadmin) => {
  const token = jwt.sign(
    { id: userId, issuperadmin: issuperadmin },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
  return token;
};

const loginUser = async ({ email, password }) => {
  try {
    const user = await User.findOneByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials! Username or Email is Incorrect");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid credentials! Password is incorrect");
    }

    const token = generateAuthToken(user.id, user.issuperadmin);
    return token;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { loginUser };
