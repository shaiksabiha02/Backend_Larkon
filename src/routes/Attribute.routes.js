import express from "express";

import {
    createAttribute,
    getAllAttributes,
    getAttributeById,
    updateAttribute,
    deleteAttribute
} from "../controllers/Attribute.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
const router = express.Router();

// Create Attribute
router.post("/",authenticate, createAttribute);

// Get All Attributes
router.get("/", getAllAttributes);

// Get Attribute By ID
//router.put("/:id", getAttributeById);

// Update Attribute
router.put("/:id",authenticate, updateAttribute);

// Delete Attribute
router.delete("/:id", authenticate,deleteAttribute);

export default router;