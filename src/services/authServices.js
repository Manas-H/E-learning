const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const generateAuthToken = (userId, issuperadmin) => {
  const token = jwt.sign(
    { id: userId, issuperadmin: issuperadmin },
    process.env.JWT_SECRET,
    {
      expiresIn: "5h",
    }
  );
  return token;
};

const loginUser = async ({ email, password }) => {
  try {
    const user = await User.findOneByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials! Email is Incorrect");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid credentials! Password is incorrect");
    }

    const token = generateAuthToken(user.id, user.issuperadmin);
    return token;
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
};

module.exports = { loginUser };
