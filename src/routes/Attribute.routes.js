import express from "express";

import {
    createAttribute,
    getAllAttributes,
    getAttributeById,
    updateAttribute,
    deleteAttribute
} from "../controllers/Attribute.controller.js";

const router = express.Router();

// Create Attribute
router.post("/", createAttribute);

// Get All Attributes
router.get("/", getAllAttributes);

// Get Attribute By ID
router.get("/:id", getAttributeById);

// Update Attribute
router.put("/:id", updateAttribute);

// Delete Attribute
router.delete("/:id", deleteAttribute);

export default router;