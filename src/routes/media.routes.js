import express from "express";

import {
    uploadMedia,
    getAllMedia,
    getMediaById,
    removeMedia
} from "../controllers/media.controller.js";

import upload from "../middlewares/upload.middleware.js";

const router = express.Router();


// ========================================
// Upload Media
// POST /api/v1/media/upload
// ========================================
router.post("/upload", upload.single("file"), uploadMedia);


// ========================================
// Get All Media
// GET /api/v1/media
// ========================================
router.get("/", getAllMedia);


// ========================================
// Get Media By ID
// GET /api/v1/media/:id
// ========================================
router.get("/:id", getMediaById);


// ========================================
// Delete Media
// DELETE /api/v1/media/:id
// ========================================
router.delete("/:id", removeMedia);


export default router;