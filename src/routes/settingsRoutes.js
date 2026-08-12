import express from "express";

import {
    fetchGeneralSettings,
    editGeneralSettings,
    fetchAdminProfile,
    editAdminProfile,
    changeAdminPasswordController
} from "../Controllers/settingsController.js";


const router = express.Router();

router.get("/general", fetchGeneralSettings);
router.put("/general", editGeneralSettings);
router.get("/profile",fetchAdminProfile);
router.put("/profile",editAdminProfile);
router.put("/profile/password",changeAdminPasswordController);

export default router;