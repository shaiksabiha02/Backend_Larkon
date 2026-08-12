import express from "express";

import {
  addRefreshToken,
  getRefreshTokens,
  getRefreshToken,
  updateRefreshToken,
  deleteRefreshToken,
  refreshAccessToken
} from "../controllers/RefreshToken.controller.js";

const router = express.Router();

// Create refresh token record
router.post("/", addRefreshToken);

// Get all refresh tokens
router.get("/", getRefreshTokens);

// Get refresh token by ID
router.get("/:id", getRefreshToken);

// Update refresh token
router.patch("/:id", updateRefreshToken);

// Delete refresh token
router.delete("/:id", deleteRefreshToken);

// Generate new access token using refresh token
router.post("/refresh", refreshAccessToken);

export default router;