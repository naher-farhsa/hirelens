const resumeModel = require("../models/resume.model");
const generateOptimizedKeywords = require("../services/ai.service");
const uploadFile = require("../services/storage.service");



async function optimizeResume(req, res) {
  try {
    const { jobDescription } = req.body;
    if (!jobDescription || typeof jobDescription !== "string") {
      return res.status(400).json({ message: "Invalid job description." });
    }
    const suggestedKeywords = await generateOptimizedKeywords(jobDescription);

    console.log("✅ Suggested Keywords:", suggestedKeywords);

    return res.status(200).json({
      message: "Keyword suggestions generated successfully",
      suggestedKeywords,
    });

  } catch (err) {
    console.error("❌ Error in optimizeResume:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
}


async function saveResume(req, res) {
  try {
    if (!req.files || !req.files.resume) {
      return res.status(400).json({ message: "No resume file uploaded" });
    }

    const file = req.files.resume;
    const newResume = await uploadFile(file.data, file.name, req.user._id, 20000);

    return res.status(201).json({
      message: "Resume uploaded successfully (will auto-delete in 10s)",
      resume: newResume,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
}


async function getUserResumes(req, res) {
  try {
    const resumes = await resumeModel
      .find({ user: req.user._id })
      .sort({ uploadedAt: -1 });
    return res.status(200).json({ resumes });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
}

module.exports = { optimizeResume, getUserResumes, saveResume};

