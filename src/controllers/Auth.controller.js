import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import pool from "../config/db.js";

import { findUserByEmail } from "../models/Auth.model.js";
import { createRefreshToken } from "../models/RefreshToken.model.js";


// REGISTER

export const register = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password
    } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Check existing user
    const existingUser = await pool.query(
      `SELECT id FROM users WHERE email = $1`,
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "User already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await pool.query(
      `INSERT INTO users
       (first_name, last_name, email, password, role)
       VALUES ($1, $2, $3, $4, 'user')
       RETURNING id, first_name, last_name, email, role`,
      [
        first_name || null,
        last_name || null,
        email,
        hashedPassword
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: result.rows[0]
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Registration failed"
    });
  }
};


// LOGIN

export const login = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Find user
    const result = await pool.query(
      `SELECT
        id,
        first_name,
        last_name,
        email,
        password,
        role
       FROM users
       WHERE email = $1`,
      [email]
    );

    // User not found
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const user = result.rows[0];

    // Check password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Generate Access Token
    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d"
      }
    );

    // Generate Refresh Token
    const refreshToken = crypto
      .randomBytes(64)
      .toString("hex");

    // Refresh token expires after 7 days
    const expiresAt = new Date();

    expiresAt.setDate(
      expiresAt.getDate() + 7
    );

    // Save Refresh Token in database
    await createRefreshToken(
      user.id,
      refreshToken,
      expiresAt,
      "active"
    );

    // Login response
    return res.status(200).json({
      success: true,
      message: "Login successful",

      accessToken: accessToken,

      refreshToken: refreshToken,

      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
};

// GET LOGGED-IN USER

export const getMe = async (req, res) => {
  try {

    const user = await findUserByEmail(
      req.user.email
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found"
      });
    }

    // Don't send password
    const {
      password,
      ...userData
    } = user;

    return res.status(200).json({
      success: true,
      message: "User Details",
      data: userData
    });

  } catch (error) {

    console.error("GET ME ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get user details"
    });
  }
};


// LOGOUT
export const logout = async (req, res) => {
  try {

    return res.status(200).json({
      success: true,
      message: "Logout successful"
    });

  } catch (error) {

    console.error("LOGOUT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Logout failed"
    });
  }
};