import express from "express";
import {
  getProfileController,
  createMyProfileController,
  updateMyProfileController,
  getResumeController,
  deleteResumeController,
  uploadAvatarController,
  deleteAvatarController,
} from "./profile.controller.js";

import { resumeUpload } from "../../middlewares/resumeUpload.middleware.js";
import { avatarUpload } from "../../middlewares/avatarUpload.middleware.js";
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
  resumeUpload.single("resume"),
  uploadResumeController,
);

router.get("/me/resume", protect, getResumeController);

router.delete("/me/resume", protect, deleteResumeController);

router.patch(
  "/me/avatar",
  protect,
  avatarUpload.single("avatar"),
  uploadAvatarController,
);

router.delete("/me/avatar", protect, deleteAvatarController);

export default router;
