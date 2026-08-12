import * as CategoryModel from "../models/Category.model.js";

// Create Category
async function createCategory(req, res) {
    try {
        const category = await CategoryModel.createCategory(req.body);

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


// Get All Categories
async function getAllCategories(req, res) {
    try {
        const categories = await CategoryModel.getAllCategories();

        res.status(200).json({
            success: true,
            data: categories
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


// Get Category By ID
async function getCategoryById(req, res) {
    try {
        const { id } = req.params;

        const category = await CategoryModel.getCategoryById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.status(200).json({
            success: true,
            data: category
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


// Update Category
async function updateCategory(req, res) {
    try {
        const { id } = req.params;

        const category = await CategoryModel.updateCategory(
            id,
            req.body
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


// Delete Category
async function deleteCategory(req, res) {
    try {
        const { id } = req.params;

        const category = await CategoryModel.deleteCategory(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            data: category
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


export {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};