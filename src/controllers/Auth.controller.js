import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import pool from "../config/db.js";


// REGISTER
export const register = async (req, res) => {
  try {
    console.log("REGISTER API HIT");
    console.log("BODY:", req.body);

    const {
      first_name,
      last_name,
      full_name,
      username,
      email,
      phone,
      password,
      designation,
      profile_image,
      role_id,
      status,
      role
    } = req.body;

    if (!first_name || !username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "First name, username, email and password are required"
      });
    }

    const emailCheck = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already exists"
      });
    }

    const usernameCheck = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );

    if (usernameCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Username already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users
      (
        first_name,
        last_name,
        full_name,
        username,
        email,
        phone,
        password,
        designation,
        profile_image,
        role_id,
        status,
        role
      )
      VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING
        id,
        first_name,
        last_name,
        full_name,
        username,
        email,
        phone,
        designation,
        profile_image,
        role_id,
        status,
        role`,
      [
        first_name,
        last_name || null,
        full_name || `${first_name} ${last_name || ""}`.trim(),
        username,
        email,
        phone || null,
        hashedPassword,
        designation || null,
        profile_image || null,
        role_id || null,
        status || "Active",
        role || "user"
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
      message: "Registration failed",
      error: error.message,
      detail: error.detail,
      code: error.code
    });
  }
};


// LOGIN
export const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const result = await pool.query(
      `SELECT
        id,
        first_name,
        last_name,
        username,
        email,
        password,
        role,
        role_id,
        status
       FROM users
       WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const user = result.rows[0];

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

    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || "jwt_secret_key",
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d"
      }
    );

    const refreshToken = crypto
      .randomBytes(64)
      .toString("hex");

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        email: user.email,
        role: user.role,
        role_id: user.role_id,
        status: user.status
      }
    });

  } catch (error) {

    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message
    });
  }
};


// GET ME
export const getMe = async (req, res) => {
  try {

    const result = await pool.query(
      `SELECT
        id,
        first_name,
        last_name,
        full_name,
        username,
        email,
        phone,
        designation,
        profile_image,
        role_id,
        status,
        role
       FROM users
       WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "User details",
      data: result.rows[0]
    });

  } catch (error) {

    console.error("GET ME ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get user details",
      error: error.message
    });
  }
};


// LOGOUT
export const logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logout successful"
  });
};