import express from "express";

import {
    globalSearch
} from "../controllers/search.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
const router = express.Router();

// Global Search
router.get("/",authenticate, globalSearch);

export default router;