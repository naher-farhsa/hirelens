// resume.route.js
const express = require("express");
const router = express.Router();
const jwtVerifier = require("../middlewares/auth.middleware");
const resumeController = require("../controllers/resume.controller");


router.post("/optimize", jwtVerifier, resumeController.optimizeResume);
router.post("/save", jwtVerifier, resumeController.saveResume);
router.get("/get", jwtVerifier, resumeController.getUserResumes);

module.exports = router;
