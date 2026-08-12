import express from "express";

import { authenticate } from "../middlewares/auth.middleware.js";

import {
  addUserRole,
  getUserRoles,
  getUserRole,
  updateUserRole,
  deleteUserRole
} from "../controllers/UserRole.controller.js";

const router = express.Router();

// Protect all User Role APIs
router.use(authenticate);

// Create User Role
router.post("/", addUserRole);

// Get All User Roles
router.get("/", getUserRoles);

// Get User Role by ID
router.get("/:id", getUserRole);

// Update User Role
router.patch("/:id", updateUserRole);

// Delete User Role
router.delete("/:id", deleteUserRole);

export default router;