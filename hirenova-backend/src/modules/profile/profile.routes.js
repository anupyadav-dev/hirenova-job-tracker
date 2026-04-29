import express from "express";
import {
  getProfileController,
  createMyProfileController,
  updateMyProfileController,
} from "./profile.controller.js";

import { upload } from "../../middlewares/upload.middleware.js";
import { uploadResumeController } from "./profile.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { profileValidation } from "./profile.validation.js";

const router = express.Router();

router.get("/me", protect, getProfileController);

router.post(
  "/",
  protect,
  profileValidation,
  validate,
  createMyProfileController,
);

router.put(
  "/me",
  protect,
  profileValidation,
  validate,
  updateMyProfileController,
);

router.patch(
  "/me/resume",
  protect,
  upload.single("resume"),
  uploadResumeController,
);

router.get("/me/resume", protect, getResumeController);

router.delete("/me/resume", protect, deleteResumeController);

export default router;
