import express from "express";

import {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} from "../controllers/Category.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
const router = express.Router();

// Create Category
router.post("/",authenticate, createCategory);

// Get All Categories
router.get("/", getAllCategories);



// Update Category
router.put("/:id", authenticate,updateCategory);

// Delete Category
router.delete("/:id", authenticate,deleteCategory);

export default router;