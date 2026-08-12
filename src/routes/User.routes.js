import express from "express";

import {
  addUser,
  updateUser,
  getUser,
  getUsers,
  deleteUser,
  lockUser,
  unlockUser
} from "../controllers/User.controller.js";

const router = express.Router();

// Create User
router.post("/", addUser);

// Get All Users
router.get("/", getUsers);

// Get User by ID
router.get("/:id", getUser);

// Update User
router.patch("/:id", updateUser);

// Lock User
router.patch("/:id/lock", lockUser);

// Unlock User
router.patch("/:id/unlock", unlockUser);

// Delete User
router.delete("/:id", deleteUser);

export default router;