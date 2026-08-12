import express from "express";

import {
    globalSearch
} from "../controllers/search.controller.js";

const router = express.Router();

// Global Search
router.get("/", globalSearch);

export default router;