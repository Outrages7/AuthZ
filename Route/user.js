const express = require("express");
const path = require("path");
const router = express.Router();

const { signup, login } = require("../Controller/Auth");
const { auth, isStudent, isAdmin } = require("../Middleware/auth");


// -----------------------------
// Serve HTML Dashboards
// -----------------------------
router.get("/student-dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "student.html"));
});

router.get("/admin-dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "admin.html"));
});


// -----------------------------
// Auth Routes
// -----------------------------
router.post("/signup", signup);
router.post("/login", login);

router.get("/test", auth, (req, res) => {
    res.json({
        success: true,
        message: "Token verified successfully"
    });
});


// -----------------------------
// Protected Student Route
// -----------------------------
router.get("/student", auth, isStudent, (req, res) => {
    res.redirect("/student-dashboard");
});

// -----------------------------
// Protected Admin Route
// -----------------------------
router.get("/admin", auth, isAdmin, (req, res) => {
    res.redirect("/admin-dashboard");
});

module.exports = router;
