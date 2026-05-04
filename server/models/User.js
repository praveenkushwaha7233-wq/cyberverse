
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: {
        type: String,
        default: "user"
    },
    xp: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("User", userSchema);