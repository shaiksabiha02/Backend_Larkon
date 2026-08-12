import jwt from "jsonwebtoken";

import {
  createRefreshToken,
  getAllRefreshTokens,
  getRefreshTokenById,
  findRefreshToken,
  updateRefreshTokenById,
  deleteRefreshTokenById
} from "../models/RefreshToken.model.js";

import { getUserById } from "../models/User.model.js";


// Create Refresh Token
export const addRefreshToken = async (req, res) => {
  try {
    const {
      user_id,
      token,
      expires_at,
      status
    } = req.body;

    if (!user_id || !token || !expires_at) {
      return res.status(400).json({
        success: false,
        message: "user_id, token and expires_at are required"
      });
    }

    const refreshToken = await createRefreshToken(
      user_id,
      token,
      expires_at,
      status || "active"
    );

    return res.status(201).json({
      success: true,
      message: "Refresh token created successfully",
      data: refreshToken
    });

  } catch (error) {
    console.error("CREATE REFRESH TOKEN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create refresh token"
    });
  }
};


// Get All Refresh Tokens
export const getRefreshTokens = async (req, res) => {
  try {
    const refreshTokens = await getAllRefreshTokens();

    return res.status(200).json({
      success: true,
      message: "Refresh tokens fetched successfully",
      data: refreshTokens
    });

  } catch (error) {
    console.error("GET REFRESH TOKENS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch refresh tokens"
    });
  }
};


// Get Refresh Token By ID
export const getRefreshToken = async (req, res) => {
  try {
    const { id } = req.params;

    const refreshToken = await getRefreshTokenById(id);

    if (!refreshToken) {
      return res.status(404).json({
        success: false,
        message: "Refresh token not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Refresh token fetched successfully",
      data: refreshToken
    });

  } catch (error) {
    console.error("GET REFRESH TOKEN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch refresh token"
    });
  }
};


// Update Refresh Token
export const updateRefreshToken = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedRefreshToken =
      await updateRefreshTokenById(id, req.body);

    if (!updatedRefreshToken) {
      return res.status(404).json({
        success: false,
        message: "Refresh token not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Refresh token updated successfully",
      data: updatedRefreshToken
    });

  } catch (error) {
    console.error("UPDATE REFRESH TOKEN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update refresh token"
    });
  }
};


// Delete Refresh Token
export const deleteRefreshToken = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRefreshToken =
      await deleteRefreshTokenById(id);

    if (!deletedRefreshToken) {
      return res.status(404).json({
        success: false,
        message: "Refresh token not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Refresh token deleted successfully",
      data: deletedRefreshToken
    });

  } catch (error) {
    console.error("DELETE REFRESH TOKEN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete refresh token"
    });
  }
};


// Refresh Access Token
export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required"
      });
    }

    // Find refresh token in database
    const storedToken = await findRefreshToken(refreshToken);

    if (!storedToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token"
      });
    }

    // Check token status
    if (storedToken.status && storedToken.status !== "active") {
      return res.status(401).json({
        success: false,
        message: "Refresh token is inactive"
      });
    }

    // Check expiration
    if (new Date(storedToken.expires_at) < new Date()) {

      await deleteRefreshTokenById(storedToken.id);

      return res.status(401).json({
        success: false,
        message: "Refresh token expired"
      });
    }

    // Get user
    const user = await getUserById(storedToken.user_id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Generate new access token
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

    return res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      accessToken
    });

  } catch (error) {
    console.error("REFRESH ACCESS TOKEN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to refresh access token"
    });
  }
};