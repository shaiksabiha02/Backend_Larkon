import * as ProductModel from "../models/Product.model.js";
import * as ProductService from "../services/product.service.js";
import cloudinary from "../config/cloudinary.js";
import csvParser from "csv-parser";
import XLSX from "xlsx";
import { Readable } from "stream";


// Create Product
async function createProduct(req, res) {
    try {
        const product = await ProductModel.createProduct(req.body);

        const { discount } = req.body;

        if (discount !== undefined) {
            await ProductService.addDiscountToProduct(
                product.id,
                discount
            );
        }

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


// Add Discount To Existing Product
async function addDiscount(req, res) {
    try {
        const { productId } = req.params;
        const { discount } = req.body;

        const result = await ProductService.addDiscountToProduct(
            productId,
            discount
        );

        res.status(201).json({
            success: true,
            message: "Discount added successfully",
            data: result
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


// Get All Products
async function getAllProducts(req, res) {
    try {
        const products = await ProductModel.getAllProducts();

        res.status(200).json({
            success: true,
            data: products
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


// Get Product By ID
async function getProductById(req, res) {
    try {
        const { id } = req.params;

        const product = await ProductModel.getProductById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


// Update Product
async function updateProduct(req, res) {
    try {
        const { id } = req.params;

        const product = await ProductModel.updateProduct(
            id,
            req.body
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


// Delete Product
async function deleteProduct(req, res) {
    try {
        const { id } = req.params;

        const product = await ProductModel.deleteProduct(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            data: product
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


// Upload Product Images
async function uploadProductImages(req, res) {
    try {
        const { id } = req.params;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please upload at least one image"
            });
        }

        const imageUrls = [];

        for (const file of req.files) {
            const uploadResult = await new Promise((resolve, reject) => {

                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "products",
                        resource_type: "image"
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );

                stream.end(file.buffer);
            });

            imageUrls.push(uploadResult.secure_url);
        }

        const product = await ProductModel.updateProductImages(
            id,
            imageUrls
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(201).json({
            success: true,
            message: "Product images uploaded successfully",
            data: {
                product: product,
                image_urls: imageUrls
            }
        });

    } catch (error) {
        console.error("Cloudinary upload error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


// Update Product Status
async function updateProductStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "active",
            "draft",
            "archived"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Use active, draft or archived"
            });
        }

        const product = await ProductModel.updateProductStatus(
            id,
            status
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product status updated successfully",
            data: product
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


// Import Products - CSV / Excel
async function importProducts(req, res) {
    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a CSV or Excel file"
            });
        }

        const fileName = req.file.originalname.toLowerCase();
        let products = [];

        // CSV
        if (fileName.endsWith(".csv")) {

            products = await new Promise((resolve, reject) => {

                const rows = [];

                Readable
                    .from([req.file.buffer.toString()])
                    .pipe(csvParser())
                    .on("data", (row) => {
                        rows.push(row);
                    })
                    .on("end", () => {
                        resolve(rows);
                    })
                    .on("error", (error) => {
                        reject(error);
                    });
            });

        }

        // Excel
        else if (
            fileName.endsWith(".xlsx") ||
            fileName.endsWith(".xls")
        ) {

            const workbook = XLSX.read(
                req.file.buffer,
                { type: "buffer" }
            );

            const sheetName = workbook.SheetNames[0];

            const worksheet = workbook.Sheets[sheetName];

            products = XLSX.utils.sheet_to_json(worksheet);
        }

        // Invalid file
        else {
            return res.status(400).json({
                success: false,
                message: "Only CSV or Excel files are allowed"
            });
        }


        if (products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "File contains no product data"
            });
        }


        const importedProducts = [];

        for (const product of products) {

            // Convert image string into array
            if (
                product.image &&
                typeof product.image === "string"
            ) {
                try {
                    product.image = JSON.parse(product.image);
                } catch {
                    product.image = [];
                }
            }

            // Default image
            if (!product.image) {
                product.image = [];
            }

            // Convert empty seller_id to null
            if (
                product.seller_id === "" ||
                product.seller_id === undefined
            ) {
                product.seller_id = null;
            }

            const createdProduct =
                await ProductModel.createProduct(product);

            importedProducts.push(createdProduct);
        }


        res.status(201).json({
            success: true,
            message: "Products imported successfully",
            data: importedProducts
        });

    } catch (error) {

        console.error("Product import error:", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


export {
    createProduct,
    addDiscount,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    uploadProductImages,
    updateProductStatus,
    importProducts
};
