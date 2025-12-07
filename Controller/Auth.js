const bcrypt = require("bcrypt");
const User = require("../Model/UserModel");
const jwt = require("jsonwebtoken");



exports.signup = async (req, res) => {
    try {
        const { name, email, pass, role } = req.body;
        if (!name || !email || !pass) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if user already exist
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(pass, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        // Respond success
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Signup failed, server error",
        });
    }
};

// Login 
exports.login = async (req, res) => {
    try {
        const { email, pass } = req.body;

        // Validation
        if (!email || !pass) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }

        // ---------------------------
        // 🔥 JWT PAYLOAD (added fields)
        // ---------------------------
        const payload = {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role
        };

        // Generate token
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "24h"
        });

        // Remove password from response
        user.password = undefined;

        // Cookie options
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        // Send Response
        return res.cookie("token", token, options).status(200).json({
            success: true,
            message: "Login successful",
            token,
            user
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message
        });
    }
};
