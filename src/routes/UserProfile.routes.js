import express from "express";

import {
  addUserProfile,
  fetchUserProfile,
  editUserProfile,
} from "../controllers/UserProfile.controller.js";

const router = express.Router();

router.post("/", addUserProfile);
router.get("/:user_id", fetchUserProfile);
router.put("/:user_id", editUserProfile);

export default router;
