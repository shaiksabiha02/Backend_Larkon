import express from "express";

import {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} from "../controllers/Category.controller.js";

const router = express.Router();

// Create Category
router.post("/", createCategory);

// Get All Categories
router.get("/", getAllCategories);

// Get Category By ID
router.get("/:id", getCategoryById);

// Update Category
router.put("/:id", updateCategory);

// Delete Category
router.delete("/:id", deleteCategory);

export default router;