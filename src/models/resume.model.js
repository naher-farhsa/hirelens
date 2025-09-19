const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  resumeUrl: {
    type: String,
    required: true,
  },
  fileId: {
    type: String, // from ImageKit
    required: true,
  },
  originalName: {
    type: String, // the actual file name (e.g., resume.pdf)
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Resumes", resumeSchema);
