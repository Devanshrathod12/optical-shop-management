const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "1d", 
    });
};

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Please provide all required fields." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User with this email already exists." });
        }

        const newUser = await User.create({
            name,
            email,
            password,
        });

       
        const token = generateToken(newUser._id);

      
        newUser.password = undefined;

        res.status(201).json({
            success: true,
            message: "User created successfully!",
            token,
            user: newUser
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please provide email and password." });
        }

        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        const token = generateToken(user._id);
        
        user.password = undefined;

        res.status(200).json({
            success: true,
            message: "Logged in successfully!",
            token,
            user
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};