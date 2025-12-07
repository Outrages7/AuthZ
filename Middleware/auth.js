const jwt = require("jsonwebtoken");

// ----------------------------
// 🔐 AUTH MIDDLEWARE
// ----------------------------
exports.auth = (req, res, next) => {
    try {
        // Extract token from cookie, header, or body
        const token =
            req.cookies?.token ||
            req.header("Authorization")?.replace("Bearer ", "") ||
            req.body?.token;

        console.log("TOKEN RECEIVED:", token);

        // Token missing
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied: No token provided",
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user info
        req.user = decoded;

        next();

    } catch (error) {
        console.log("AUTH ERROR:", error.message);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

// ----------------------------
// 🎓 STUDENT-ONLY PROTECTION
// ----------------------------
exports.isStudent = (req, res, next) => {
    if (!req.user || req.user.role !== "Student") {
        return res.status(403).json({
            success: false,
            message: "Protected route: Only students allowed",
        });
    }

    next();
};

// ----------------------------
// 🛡 ADMIN-ONLY PROTECTION
// ----------------------------
exports.isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "Admin") {
        return res.status(403).json({
            success: false,
            message: "Protected route: Only admins allowed",
        });
    }

    next();
};
