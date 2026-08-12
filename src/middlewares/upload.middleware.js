import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// ========================================
// Cloudinary Storage
// ========================================

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,

    params: {
        folder: "media",
        allowed_formats: ["jpg", "jpeg", "png", "webp"]
    }
});

// ========================================
// Multer Upload
// ========================================

const upload = multer({
    storage: storage
});

export default upload;