const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

async function jwtVerifier(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized user access, login first",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await userModel.findOne({
      _id: decoded.id,
    });
    req.user = user;
    next();         // next() is imp in middleware without the req wont pass to next handler
  } catch (err) {
    return res.status(401).json({
      mesage: "Invalid token used, login again",
    });
  }
}

module.exports=jwtVerifier  