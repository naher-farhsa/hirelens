const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/user.model");

async function registerController(req, res) {
  const { username, password } = req.body;

  const isUserAlreadyExists = await userModel.findOne({ username });

  if (isUserAlreadyExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await userModel.create({
    username,
    password: await bcrypt.hash(password, 10),
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);

  res.cookie("token", token);

  // Redirect to the editor page after successful registration
  return res.redirect("/editor");
}

async function loginController(req, res) {
  const { username, password } = req.body;

  const isUserExists = await userModel.findOne({ username });
  if (!isUserExists) {
    return res.status(400).json({
      message: "Invalid, user not found",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, isUserExists.password);
  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid, user password",
    });
  }

  const token = jwt.sign({ id: isUserExists._id }, process.env.JWT_SECRET_KEY);
  res.cookie("token", token);

  // Redirect to the editor page after successful login
  return res.redirect("/editor");
}

module.exports = {
  registerController,
  loginController,
};
