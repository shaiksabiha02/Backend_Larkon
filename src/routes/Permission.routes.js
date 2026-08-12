import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";

import {
  addPermission,
  getPermissions,
  getPermission,
  updatePermission,
  deletePermission
} from "../controllers/Permission.controller.js";

const router = express.Router();

// Protect all Permission APIs
router.use(authenticate);

router.post("/", addPermission);
router.get("/", getPermissions);
router.get("/:id", getPermission);
router.patch("/:id", updatePermission);
router.delete("/:id", deletePermission);

export default router;