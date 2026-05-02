require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

/* ================= MIDDLEWARE ================= */

// ✅ FIXED CORS (for local + render)
app.use(cors({
    origin: "*"
}));

app.use(express.json());

/* ================= API ROUTES ================= */

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/progress", require("./routes/progress"));

/* ================= FRONTEND SERVING ================= */

// 🔥 VERY IMPORTANT (serves your HTML files)
app.use(express.static(path.join(__dirname, "../")));

/* ================= HEALTH CHECK ================= */

app.get("/api", (req, res) => {
    res.json({ message: "🚀 CyberVerse API running" });
});

/* ================= SPA / FALLBACK ================= */

// 🔥 Fix blank page issue (important for Render)


app.use((req, res) => {
    res.sendFile(path.join(__dirname, "../index.html"));
});
/* ================= DATABASE CONNECTION ================= */

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing in .env");
        }

        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ MongoDB Connected");

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    } catch (err) {
        console.error("❌ DB Error:", err.message);
        process.exit(1);
    }
};

connectDB();