const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/user.model");
const blackTokenModel = require("../models/blackToken.model");

async function registerController(req, res) {
  try {
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
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production", // secure only in prod (Render)
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    // Redirect to the editor page after successful registration
    return res.redirect("/editor");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Registration failed" });
  }
}

async function loginController(req, res) {
  try {
    const { username, password } = req.body;

    const isUserExists = await userModel.findOne({ username });
    if (!isUserExists) {
      return res.status(400).json({
        message: "Invalid, user not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      isUserExists.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid, user password",
      });
    }

    const token = jwt.sign(
      { id: isUserExists._id },
      process.env.JWT_SECRET_KEY
    );
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production", // secure only in prod (Render)
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    // Redirect to the editor page after successful login
    return res.redirect("/editor");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Login failed" });
  }
}

async function logoutController(req, res) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({ message: "No token found" });
    }

    // Add token to blacklist (TTL auto-deletes after 2 min)
    await blackTokenModel.create({ token });

    // Clear cookie
    res.clearCookie("token", { httpOnly: true, sameSite: "Strict" });
    return res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Logout failed" });
  }
}

module.exports = {
  registerController,
  loginController,
  logoutController,
};
