import express from "express";

import {
    fetchGeneralSettings,
    editGeneralSettings,
    fetchAdminProfile,
    editAdminProfile,
    changeAdminPasswordController
} from "../Controllers/settingsController.js";

import { authenticate } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

router.get("/general", fetchGeneralSettings);
router.put("/general", editGeneralSettings);
router.get("/profile",authenticate,requireAdmin,fetchAdminProfile);
router.put("/profile",authenticate,requireAdmin,editAdminProfile);
router.put("/profile/password",authenticate,requireAdmin,changeAdminPasswordController);

export default router;