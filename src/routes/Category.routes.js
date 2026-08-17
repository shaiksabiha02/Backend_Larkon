import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";

import {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} from "../controllers/Category.controller.js";

const router = express.Router();

router.post(
    "/",
    authenticate,
    /* #swagger.tags = ['Categories'] */

    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Create a new category',
        required: true,
        schema: {
            category_name: 'Fashion',
            description: 'Fashion products collection',
            status: 'active'
        }
    } */

    createCategory
);

router.get(
    "/",

    /* #swagger.tags = ['Categories'] */

    getAllCategories
);

router.get(
    "/:id",

    /* #swagger.tags = ['Categories'] */

    getCategoryById
);

router.put(
    "/:id",
    authenticate,

    /* #swagger.tags = ['Categories'] */

    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Update category',
        required: true,
        schema: {
            category_name: 'Updated Fashion',
            description: 'Updated category description',
            status: 'active'
        }
    } */

    updateCategory
);

router.delete(
    "/:id",
    authenticate,

    /* #swagger.tags = ['Categories'] */

    deleteCategory
);

export default router;