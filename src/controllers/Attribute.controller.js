import * as AttributeModel from "../models/Attribute.model.js";

// Create Attribute
async function createAttribute(req, res) {
    try {
        const attribute = await AttributeModel.createAttribute(req.body);

        res.status(201).json({
            success: true,
            message: "Attribute created successfully",
            data: attribute
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


// Get All Attributes
async function getAllAttributes(req, res) {
    try {
        const attributes = await AttributeModel.getAllAttributes();

        res.status(200).json({
            success: true,
            data: attributes
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


// Get Attribute By ID
async function getAttributeById(req, res) {
    try {
        const { id } = req.params;

        const attribute = await AttributeModel.getAttributeById(id);

        if (!attribute) {
            return res.status(404).json({
                success: false,
                message: "Attribute not found"
            });
        }

        res.status(200).json({
            success: true,
            data: attribute
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


// Update Attribute
async function updateAttribute(req, res) {
    try {
        const { id } = req.params;

        const attribute = await AttributeModel.updateAttribute(
            id,
            req.body
        );

        if (!attribute) {
            return res.status(404).json({
                success: false,
                message: "Attribute not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Attribute updated successfully",
            data: attribute
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}


// Delete Attribute
async function deleteAttribute(req, res) {
    try {
        const { id } = req.params;

        const attribute = await AttributeModel.deleteAttribute(id);

        if (!attribute) {
            return res.status(404).json({
                success: false,
                message: "Attribute not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Attribute deleted successfully",
            data: attribute
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
    createAttribute,
    getAllAttributes,
    getAttributeById,
    updateAttribute,
    deleteAttribute
};