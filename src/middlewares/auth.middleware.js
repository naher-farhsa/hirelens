const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const blackTokenModel = require("../models/blackToken.model")

async function jwtVerifier(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized user access, login first" });
  }

  try {
    // 1. Check if token is blacklisted
    const blacklisted = await blackTokenModel.findOne({ token });
    if (blacklisted) {
      return res.status(401).json({ message: "Token logged out, please login again" });
    }

    // 2. Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // 3. Attach user to req
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;

    next(); // pass control to next handler
  } catch (err) {
    return res.status(401).json({ message: "Invalid token used, login again" });
  }
}

module.exports = jwtVerifier;
