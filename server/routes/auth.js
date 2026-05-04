const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

// ✅ REGISTER
router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
        username,
        password: hashed
    });

    await user.save();

    res.json({ message: "User registered" });
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ msg: "Wrong password" });

    const token = jwt.sign(
        { id: user._id, role: user.role },
        "secret123"
    );

    res.json({
        token,
        role: user.role,
        username: user.username
    });
});

module.exports = router;