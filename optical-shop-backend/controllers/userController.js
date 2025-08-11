const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

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
        const newUser = await User.create({ name, email, password });
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

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User with this email does not exist." });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save({ validateBeforeSave: false });

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const message = `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`;
        await transporter.sendMail({
            from: `Your App <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Password Reset OTP",
            text: message,
        });

        res.status(200).json({ success: true, message: `OTP sent to ${user.email}` });
    } catch (error) {
        console.error(error);
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save({ validateBeforeSave: false });
        }
        res.status(500).json({ success: false, message: "Error sending email. Please try again." });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({ success: false, message: "OTP is invalid or has expired." });
        }
        res.status(200).json({ success: true, message: "OTP verified successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, password } = req.body;
        const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({ success: false, message: "OTP is invalid or has expired." });
        }
        user.password = password;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        const token = generateToken(user._id);
        user.password = undefined;
        res.status(200).json({
            success: true,
            message: "Password has been reset successfully!",
            token,
            user,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};