import express from "express";

import {
  addPasswordReset,
  getPasswordResets,
  getPasswordReset,
  updatePasswordReset,
  deletePasswordReset,
  forgotPassword,
  resetPassword
} from "../controllers/PasswordReset.controller.js";

const router = express.Router();

// Forgot Password
router.post("/forgot-password", forgotPassword);

// Reset Password
router.post("/reset-password", resetPassword);

// Password Reset CRUD
router.post("/", addPasswordReset);

router.get("/", getPasswordResets);

router.get("/:id", getPasswordReset);

router.patch("/:id", updatePasswordReset);

router.delete("/:id", deletePasswordReset);

export default router;