"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login_user = exports.verify_user = exports.register_user = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const register_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, password } = req.body;
    try {
        const existing_user = yield user_model_1.User.findOne({ email: email });
        if (existing_user) {
            return res.status(409).json({ error: "Email already registered" });
        }
        const salt_rounds = 10;
        const salt = yield bcrypt_1.default.genSalt(salt_rounds);
        const pepper = process.env.PEPPER;
        const hashed_password = yield bcrypt_1.default.hash(password + pepper, salt);
        const email_verification_token = jsonwebtoken_1.default.sign(email, process.env.JWT_SECRET);
        const newUser = new user_model_1.User({
            email: email,
            password: hashed_password,
            name: name || "",
            email_verification_token: email_verification_token,
        });
        yield newUser.save();
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            host: " smtp.gmail.com",
            port: 587,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_EMAIL_PASS,
            },
        });
        const mail_options = {
            from: process.env.SMTP_EMAIL,
            to: email,
            subject: "Email Verification FOR IDEON",
            html: `<a href='${process.env.CLIENT_URI}/confirmation?token=${email_verification_token}'>Please click here to verify your email</a>`,
        };
        transporter.sendMail(mail_options, (error, info) => {
            if (error) {
                console.error("Email sending failed", error);
                return res
                    .status(500)
                    .json({ message: "Failed to send verification email" });
            }
            console.log("Email sent:", info.response);
            res.status(200).json({
                message: "User registered successfully. Please check your email for verification instructions.",
            });
        });
    }
    catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
});
exports.register_user = register_user;
const verify_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.query;
        const user = yield user_model_1.User.findOne({ email_verification_token: token });
        if (!user) {
            return res.status(404).json({ message: "no user found" });
        }
        else {
            const decoded_token = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            if (user && decoded_token) {
                user.is_email_verified = true;
                yield user.save();
                res.status(200).json({ message: "email confirmation completed" });
            }
            else {
                res.status(400).json({ message: "unverified token" });
            }
        }
    }
    catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
});
exports.verify_user = verify_user;
const login_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_email, user_password } = req.body;
        const user = yield user_model_1.User.findOne({ email: user_email });
        if (user && user.is_email_verified) {
            const is_password = yield bcrypt_1.default.compare(user_password + process.env.PEPPER, user.password);
            if (is_password) {
                const { _id, email } = user;
                const payload = {
                    user: {
                        _id,
                        email,
                    },
                };
                const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
                    expiresIn: "48h",
                });
                res.cookie("session", token, {
                    maxAge: 48 * 60 * 60 * 1000,
                    httpOnly: true,
                    secure: true, // Send cookie over HTTPS only (requires HTTPS setup)
                });
                res
                    .status(200)
                    .json({ message: "logged in successfully", user });
            }
            else {
                // Incorrect password
                res.status(401).json({ message: "Invalid credentials" });
            }
        }
        else {
            // User not found
            res.status(404).json({
                message: `${!user ? "User not found" : "User email not verified"}`,
            });
        }
    }
    catch (error) {
        res.status(500).json({ message: "something went wrong" });
        console.log(error);
    }
});
exports.login_user = login_user;
