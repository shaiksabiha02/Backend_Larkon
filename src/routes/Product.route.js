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
} from "../controllers/product.controller.js";

import upload from "../middlewares/upload.middleware.js";

const router = express.Router();


// Product APIs

// Create Product
router.post(
    "/",
    authenticate,

    /* #swagger.tags = ['Products'] */

    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Create a new product',
        required: true,
        schema: {
            product_name: 'Test T-Shirt',
            category_id: 1,
            seller_id: 1,
            brand: 'Nike',
            weight: '500g',
            gender: 'Unisex',
            size: 'L',
            color: 'Black',
            description: 'Comfortable cotton T-Shirt',
            tag_number: 'TSHIRT001',
            stock: 50,
            tag: 'Fashion',
            price: 999,
            tax: 18,
            image: [],
            status: 'active',
            discount: 10
        }
    } */

    createProduct
);


// Get All Products
router.get(
    "/",

    /* #swagger.tags = ['Products'] */

    getAllProducts
);


// Get Product By ID
router.get(
    "/:id",

    /* #swagger.tags = ['Products'] */

    getProductById
);


// Update Product
router.put(
    "/:id",
    authenticate,

    /* #swagger.tags = ['Products'] */

    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Update product',
        required: true,
        schema: {
            product_name: 'Updated T-Shirt',
            category_id: 1,
            seller_id: 1,
            brand: 'Nike',
            weight: '500g',
            gender: 'Unisex',
            size: 'L',
            color: 'Black',
            description: 'Updated product description',
            tag_number: 'TSHIRT001',
            stock: 40,
            tag: 'Fashion',
            price: 899,
            tax: 18,
            image: [],
            status: 'active'
        }
    } */

    updateProduct
);


// Delete Product
router.delete(
    "/:id",
    authenticate,

    /* #swagger.tags = ['Products'] */

    deleteProduct
);


// Upload Product Images
router.post(
    "/:id/images",

    /* #swagger.tags = ['Products'] */

    upload.array("images", 5),
    authenticate,
    uploadProductImages
);


// Update Product Status
router.patch(
    "/:id/status",
    authenticate,

    /* #swagger.tags = ['Products'] */

    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Update product status',
        required: true,
        schema: {
            status: 'active'
        }
    } */

    updateProductStatus
);


// Import Products (CSV / Excel)
router.post(
    "/import",

    /* #swagger.tags = ['Products'] */

    upload.single("file"),
    authenticate,
    importProducts
);


export default router;
