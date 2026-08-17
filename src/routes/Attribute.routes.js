import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";

import {
    createAttribute,
    getAllAttributes,
    getAttributeById,
    updateAttribute,
    deleteAttribute
} from "../controllers/Attribute.controller.js";

const router = express.Router();

router.post(
    "/",
    authenticate,

    /* #swagger.tags = ['Attributes'] */

    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Create a new attribute',
        required: true,
        schema: {
            attribute_name: 'Brand',
            attribute_value: 'Nike'
        }
    } */

    createAttribute
);

router.get(
    "/",

    /* #swagger.tags = ['Attributes'] */

    getAllAttributes
);

router.get(
    "/:id",

    /* #swagger.tags = ['Attributes'] */

    getAttributeById
);

router.put(
    "/:id",
    authenticate,

    /* #swagger.tags = ['Attributes'] */

    /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Update attribute',
        required: true,
        schema: {
            attribute_name: 'Brand',
            attribute_value: 'Adidas'
        }
    } */

    updateAttribute
);

router.delete(
    "/:id",
    authenticate,

    /* #swagger.tags = ['Attributes'] */

    deleteAttribute
);

export default router;