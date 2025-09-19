const express = require("express");
const path = require("path");
const fileUpload = require("express-fileupload");
const authRoutes = require("./routes/auth.route");
const resumeRoutes = require("./routes/resume.route");
const cookieParser = require("cookie-parser");
const jwtVerifier = require("./middlewares/auth.middleware");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(fileUpload());
app.use(cookieParser());

// Set static folder for public assets
app.use(express.static(path.join(__dirname, "..", "public")));


// Set EJS as the view engine
app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "ejs");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);

// Render EJS pages
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/editor", jwtVerifier, (req, res) => {
  res.render("editor");
});

app.get("/resumes", jwtVerifier, (req, res) => {
  res.render("resumes"); 
});

// Catch-all route for undefined routes
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// Centralized error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

module.exports = app;