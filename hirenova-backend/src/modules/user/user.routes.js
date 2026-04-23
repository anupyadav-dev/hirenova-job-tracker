import express from "express";

import { getProfileController } from "./user.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/me", protect, getProfileController);

export default router;
