import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    uploadProductImages,
    updateProductStatus,
    importProducts
} from "../controllers/Product.controller.js";

import upload from "../middlewares/upload.middleware.js";

const router = express.Router();


// Product APIs

// Create Product
router.post("/", authenticate,createProduct);

// Get All Products
router.get("/", getAllProducts);

// Get Product By ID
router.get("/:id", getProductById);

// Update Product
router.put("/:id", authenticate,updateProduct);

// Delete Product
router.delete("/:id", authenticate,deleteProduct);

// Upload Product Images
router.post(
    "/:id/images",
    upload.array("images", 5),authenticate,
    uploadProductImages
);

// Update Product Status
router.patch("/:id/status", authenticate,updateProductStatus);

// Import Products (CSV / Excel)
router.post(
    "/import",
    upload.single("file"),authenticate,
    importProducts
);


export default router;
