import express from "express";

import {
  addLoginHistory,
  fetchAllLoginHistory,
  fetchLoginHistoryByUser,
} from "../controllers/LoginHistory.controller.js";

const router = express.Router();

router.post("/", addLoginHistory);
router.get("/", fetchAllLoginHistory);
router.get("/user/:user_id", fetchLoginHistoryByUser);

export default router;
