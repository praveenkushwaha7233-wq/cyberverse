const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  userId: String,
  labId: String,
  completed: Boolean
});

module.exports = mongoose.model("Progress", progressSchema);