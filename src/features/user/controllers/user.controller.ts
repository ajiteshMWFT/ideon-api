import { Request, Response } from "express";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

export const register_user = async (req: Request, res: Response) => {
  const { email, name, password } = req.body;

  try {
    const existing_user = await User.findOne({ email: email });
    if (existing_user) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const salt_rounds = 10;
    const salt = await bcrypt.genSalt(salt_rounds);
    const pepper = process.env.PEPPER;
    const hashed_password = await bcrypt.hash(password + pepper, salt);

    const email_verification_token = jwt.sign(
      email,
      process.env.JWT_SECRET as string
    );

    const newUser = new User({
      email: email,
      password: hashed_password,
      name: name || "",
      email_verification_token: email_verification_token,
    });
    await newUser.save();

    const transporter = nodemailer.createTransport({
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
        message:
          "User registered successfully. Please check your email for verification instructions.",
      });
    });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

export const verify_user = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ email_verification_token: token });
    if (!user) {
      return res.status(404).json({ message: "no user found" });
    } else {
      const decoded_token = jwt.verify(
        token as string,
        process.env.JWT_SECRET as string
      );
      if (user && decoded_token) {
        user.is_email_verified = true;
        await user.save();
        res.status(200).json({ message: "email confirmation completed" });
      } else {
        res.status(400).json({ message: "unverified token" });
      }
    }
  } catch (error: any) {
    res.status(500).json({ message: "something went wrong" });
  }
};

export const login_user = async (req: Request, res: Response) => {
  try {
    const { user_email, user_password } = req.body;
    const user = await User.findOne({ email: user_email });
    if (user && user.is_email_verified) {
      const is_password = await bcrypt.compare(
        user_password + process.env.PEPPER,
        user.password
      );
      if (is_password) {
        const { _id, email } = user;
        const payload = {
          user: {
            _id,
            email,
          },
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
          expiresIn: "48h",
        });

        res.cookie("session", token, {
          maxAge: 48 * 60 * 60 * 1000, // Cookie expiration time (48 hours in this example)
          httpOnly: true, // Cookie is not accessible via JavaScript
          secure: true, // Send cookie over HTTPS only (requires HTTPS setup)
        });

        res
          .status(200)
          .json({ message: "logged in successfully", user });
      } else {
        // Incorrect password
        res.status(401).json({ message: "Invalid credentials" });
      }
    } else {
      // User not found
      res.status(404).json({
        message: `${!user ? "User not found" : "User email not verified"}`,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
    console.log(error);
  }
};

