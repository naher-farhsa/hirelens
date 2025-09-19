const ImageKit = require("imagekit");
const resumeModel = require("../models/resume.model");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadFile(fileBuffer, filename, userId, autoDeleteMs = 5 * 24 * 60 * 60 * 1000) {
  try {
    // 1️⃣ Upload to ImageKit
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: filename,
      folder: "Resume_Optimized",
    });

    // 2️⃣ Save in MongoDB
    const newResume = await resumeModel.create({
      user: userId,
      resumeUrl: response.url,
      fileId: response.fileId,
      originalName: filename,
      uploadedAt: new Date(),
    });

    // 3️⃣ Schedule auto-delete (from ImageKit + MongoDB)
    setTimeout(async () => {
      try {
        // Delete file from ImageKit
        await imagekit.deleteFile(response.fileId);

        // Delete record from MongoDB
        await resumeModel.findByIdAndDelete(newResume._id);

        console.log(`✅ Auto-deleted resume: ${newResume._id}`);
      } catch (err) {
        console.error(`❌ Auto-delete failed for ${newResume._id}:`, err.message);
      }
    }, autoDeleteMs);

    return newResume; // return DB document
  } catch (err) {
    console.error("ImageKit upload error:", err.message);
    throw err;
  }
}

module.exports = uploadFile;
