import express from "express";
import pool from "../config/db.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

router.patch(
  "/users/:userId/role",
  authenticate,
  requireAdmin,
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!["user", "admin"].includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role"
        });
      }

      const result = await pool.query(
        `UPDATE users
         SET role = $1
         WHERE id = $2
         RETURNING id, email, role`,
        [role, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Role updated successfully",
        user: result.rows[0]
      });

    } catch (error) {
      console.error("ADMIN ROLE UPDATE ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to update role"
      });
    }
  }
);

export default router;