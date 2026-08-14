import {
    createMedia,
    findMediaById,
    findAllMedia,
    deleteMedia
} from "../models/media.model.js";


// ========================================
// Upload Media
// ========================================

export const uploadMedia = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "File is required"
            });
        }

        const media = await createMedia({
            fileName: req.file.originalname,
            fileUrl: req.file.path,
            fileType: req.file.mimetype,
            fileSize: req.file.size
        });

        res.status(201).json({
            success: true,
            message: "Media uploaded successfully",
            data: media
        });

    } catch (error) {
        console.error("Upload Media Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to upload media"
        });
    }
};

// ========================================
// Get All Media
// ========================================

export const getAllMedia = async (req, res) => {

    try {

        const media = await findAllMedia();

        res.status(200).json({

            success: true,

            data: media

        });

    } catch (error) {

        console.error("Get All Media Error:", error);

        res.status(500).json({

            success: false,

            message: "Failed to fetch media"

        });

    }
};


// ========================================
// Get Media By ID
// ========================================

export const getMediaById = async (req, res) => {

    try {

        const { id } = req.params;

        const media = await findMediaById(id);

        if (!media) {

            return res.status(404).json({

                success: false,

                message: "Media not found"

            });

        }

        res.status(200).json({

            success: true,

            data: media

        });

    } catch (error) {

        console.error("Get Media Error:", error);

        res.status(500).json({

            success: false,

            message: "Failed to fetch media"

        });

    }
};


// ========================================
// Delete Media
// ========================================

export const removeMedia = async (req, res) => {

    try {

        const { id } = req.params;

        const media = await deleteMedia(id);

        if (!media) {

            return res.status(404).json({

                success: false,

                message: "Media not found"

            });

        }

        res.status(200).json({

            success: true,

            message: "Media deleted successfully",

            data: media

        });

    } catch (error) {

        console.error("Delete Media Error:", error);

        res.status(500).json({

            success: false,

            message: "Failed to delete media"

        });

    }
};