import express from "express";

import { authenticate } from "../middlewares/auth.middleware.js";

import {
  addRole,
  getRoles,
  getRole,
  updateRole,
  deleteRole
} from "../controllers/Role.controller.js";

const router = express.Router();

// All Role APIs are private
router.use(authenticate);

// Get all roles
router.get("/", getRoles);

// Create role
router.post("/", addRole);

// Get role by ID
router.get("/:id", getRole);

// Update role
router.put("/:id", updateRole);

// Delete role
router.delete("/:id", deleteRole);

export default router;