const bcrypt = require("bcrypt");
const User = require("../Model/UserModel");

exports.signup = async (req, res) => {
    try {
        const { name, email, pass, role } = req.body;

        // Check missing fields
        if (!name || !email || !pass) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if user already exists
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
