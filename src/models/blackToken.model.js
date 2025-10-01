const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema({
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, index: { expires: 120 } }, 
});

const blackTokenModel = mongoose.model("blacktoken", blacklistSchema);
module.exports = blackTokenModel;
