const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

/* ================= REGISTER ================= */

router.post("/register", async (req, res) => {
    try {

        const { username, password } = req.body;

        // validation
        if (!username || !password) {
            return res.status(400).json({
                msg: "Please enter all fields"
            });
        }

        // existing user
        let user = await User.findOne({ username });

        if (user) {
            return res.status(400).json({
                msg: "User already exists"
            });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        // create user
        user = new User({
            username,
            password: hashedPassword,
            role: username === "kabir" ? "admin" : "student"
        });

        await user.save();

        res.json({
            msg: "Registration successful"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            msg: "Server Error"
        });
    }
});

/* ================= LOGIN ================= */

router.post("/login", async (req, res) => {

    try {

        const { username, password } = req.body;

        // check fields
        if (!username || !password) {
            return res.status(400).json({
                msg: "Please enter all fields"
            });
        }

        // find user
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({
                msg: "User not found"
            });
        }

        // compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                msg: "Invalid password"
            });
        }

        // token
        const token = jwt.sign(
            {
                id: user._id
            },
            process.env.JWT_SECRET || "cyberverse_secret",
            {
                expiresIn: "7d"
            }
        );

        // response
        res.json({
            token,
            username: user.username,
            role: user.role
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            msg: "Server Error"
        });
    }
});

module.exports = router;