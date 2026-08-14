import express from "express";

import {
  addRolePermission,
  getRolePermissions,
  getRolePermission,
  updateRolePermission,
  deleteRolePermission
} from "../controllers/RolePermission.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All Role-Permission APIs are private
router.use(authenticate);

// Create Role Permission
router.post("/", addRolePermission);

// Get All Role Permissions
router.get("/", getRolePermissions);

// Get Role Permission by ID
router.get("/:id", getRolePermission);

// Update Role Permission
router.patch("/:id", updateRolePermission);

// Delete Role Permission
router.delete("/:id", deleteRolePermission);

export default router;