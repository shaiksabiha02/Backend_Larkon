import crypto from "crypto";
import bcrypt from "bcryptjs";
import pool from "../config/db.js";

import {
  createPasswordReset,
  getAllPasswordResets,
  getPasswordResetById,
  updatePasswordResetById,
  deletePasswordResetById
} from "../models/PasswordReset.model.js";

// FORGOT PASSWORD

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    // Find user
    const userResult = await pool.query(
      `SELECT id, email
       FROM users
       WHERE email = $1`,
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const user = userResult.rows[0];

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Token expires in 15 minutes
    const expiresAt = new Date(
      Date.now() + 15 * 60 * 1000
    );

    // Save reset token
    const passwordReset = await createPasswordReset(
      user.id,
      resetToken,
      expiresAt,
      "active"
    );

    return res.status(200).json({
      success: true,
      message: "Password reset token generated successfully",
      data: {
        reset_token: resetToken,
        expires_at: expiresAt,
        user_id: user.id
      }
    });

  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to process forgot password"
    });
  }
};


// RESET PASSWORD

export const resetPassword = async (req, res) => {
  try {
    const {
      reset_token,
      new_password
    } = req.body;

    if (!reset_token || !new_password) {
      return res.status(400).json({
        success: false,
        message: "reset_token and new_password are required"
      });
    }

    // Find active reset token
    const result = await pool.query(
      `SELECT *
       FROM password_resets
       WHERE reset_token = $1
       AND status = 'active'
       LIMIT 1`,
      [reset_token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token"
      });
    }

    const passwordReset = result.rows[0];

    // Check expiration
    if (
      new Date(passwordReset.expires_at) < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Reset token has expired"
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      new_password,
      10
    );

    // Update user's password
    await pool.query(
      `UPDATE users
       SET password = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [
        hashedPassword,
        passwordReset.user_id
      ]
    );

    // Mark token as used
    await pool.query(
      `UPDATE password_resets
       SET status = 'used'
       WHERE id = $1`,
      [passwordReset.id]
    );

    return res.status(200).json({
      success: true,
      message: "Password reset successfully"
    });

  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reset password"
    });
  }
};

// CREATE PASSWORD RESET

export const addPasswordReset = async (req, res) => {
  try {
    const {
      user_id,
      reset_token,
      expires_at,
      status
    } = req.body;

    const passwordReset = await createPasswordReset(
      user_id,
      reset_token,
      expires_at,
      status
    );

    return res.status(201).json({
      success: true,
      message: "Password reset created successfully",
      data: passwordReset
    });

  } catch (error) {
    console.error("CREATE PASSWORD RESET ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET ALL PASSWORD RESETS

export const getPasswordResets = async (req, res) => {
  try {
    const passwordResets =
      await getAllPasswordResets();

    return res.status(200).json({
      success: true,
      message: "Password resets fetched successfully",
      data: passwordResets
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// GET PASSWORD RESET BY ID

export const getPasswordReset = async (req, res) => {
  try {
    const { id } = req.params;

    const passwordReset =
      await getPasswordResetById(id);

    if (!passwordReset) {
      return res.status(404).json({
        success: false,
        message: "Password reset not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password reset fetched successfully",
      data: passwordReset
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// UPDATE PASSWORD RESET

export const updatePasswordReset = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedPasswordReset =
      await updatePasswordResetById(
        id,
        req.body
      );

    if (!updatedPasswordReset) {
      return res.status(404).json({
        success: false,
        message: "Password reset not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password reset updated successfully",
      data: updatedPasswordReset
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// DELETE PASSWORD RESET

export const deletePasswordReset = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPasswordReset =
      await deletePasswordResetById(id);

    if (!deletedPasswordReset) {
      return res.status(404).json({
        success: false,
        message: "Password reset not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password reset deleted successfully",
      data: deletedPasswordReset
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};