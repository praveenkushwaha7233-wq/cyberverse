require("dotenv").config();

console.log("ENV CHECK:", process.env.MONGO_URI ? "Loaded ✅" : "Missing ❌");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(cors({ origin: "*" }));
app.use(express.json());

/* ================= API ROUTES ================= */

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/progress", require("./routes/progress"));

/* ================= FRONTEND SERVING ================= */

// 🔥 MUST point to /client (not ../)
const CLIENT_PATH = path.join(__dirname, "../client");

app.use(express.static(CLIENT_PATH));

/* ================= HEALTH CHECK ================= */

app.get("/api", (req, res) => {
    res.json({ message: "🚀 CyberVerse API running" });
});

/* ================= FALLBACK (IMPORTANT) ================= */

// 🔥 This fixes blank page on refresh
app.get("*", (req, res) => {
    res.sendFile(path.join(CLIENT_PATH, "index.html"));
});

/* ================= DATABASE CONNECTION ================= */

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing in .env");
        }

        console.log("🔄 Connecting to MongoDB...");

      await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000
});

        console.log("✅ MongoDB Connected");

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    } catch (err) {
        console.error("❌ DB ERROR:");
        console.error(err.message);
        process.exit(1); // stop app if DB fails
    }
};

connectDB();