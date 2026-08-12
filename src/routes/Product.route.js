import express from "express";

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
router.post("/", createProduct);

// Get All Products
router.get("/", getAllProducts);

// Get Product By ID
router.get("/:id", getProductById);

// Update Product
router.put("/:id", updateProduct);

// Delete Product
router.delete("/:id", deleteProduct);

// Upload Product Images
router.post(
    "/:id/images",
    upload.array("images", 5),
    uploadProductImages
);

// Update Product Status
router.patch("/:id/status", updateProductStatus);

// Import Products (CSV / Excel)
router.post(
    "/import",
    upload.single("file"),
    importProducts
);


export default router;
