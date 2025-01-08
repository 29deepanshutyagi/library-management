import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import prisma from "../config/prismaClient";
import { AsyncRequestHandler } from "../types/express";
import {config} from "../config/config";



const { jwtSecret, emailSecret, email } = config;

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email.user,
    pass: email.pass,
  },
});

interface RegisterBody {
  name: string;
  email: string;
  password: string;
  role?: string;
}

interface LoginBody {
  email: string;
  password: string;
}

interface VerifyEmailQuery {
  token: string;
}

export const register: AsyncRequestHandler<{}, any, RegisterBody> = async (
  req,
  res,
) => {
  try {
    const { name, email: userEmail, password, role } = req.body;

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { email: userEmail } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await prisma.user.create({
      data: { 
        name, 
        email: userEmail, 
        password, 
        role, 
        emailVerified: false 
      },
    });

    // Generate an email verification token
    const emailToken = jwt.sign({ userId: user.id }, emailSecret, { expiresIn: "1h" });

    // Send verification email
    const verificationLink = `http://localhost:3000/verify-email?token=${emailToken}`;
    await transporter.sendMail({
      from: `"Library Management" <${email.user}>`,
      to: userEmail,
      subject: "Verify Your Email",
      text: `Click the link to verify your email: ${verificationLink}`,
      html: `<p>Click the link to verify your email:</p><a href="${verificationLink}">${verificationLink}</a>`,
    });

    res.status(201).json({
      message: "User registered successfully. Please verify your email to activate your account.",
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

export const verifyEmail: AsyncRequestHandler<{}, any, {}, VerifyEmailQuery> = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Missing token" });
    }

    const { userId } = jwt.verify(token as string, emailSecret) as { userId: string };

    await prisma.user.update({
      where: { id: Number(userId) },
      data: { emailVerified: true },
    });

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token", error });
  }
};

export const login: AsyncRequestHandler<{}, any, LoginBody> = async (
  req,
  res,
) => {
  try {
    const { email: userEmail, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.emailVerified) {
      return res.status(403).json({ message: "Email not verified" });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, jwtSecret, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};
