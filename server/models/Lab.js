const mongoose = require("mongoose");

const labSchema = new mongoose.Schema({
  title: String,
  description: String,
  xp: Number,
  difficulty: String
});

module.exports = mongoose.model("Lab", labSchema);