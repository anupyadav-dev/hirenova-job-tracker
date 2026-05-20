import { Router } from "express";

import { avatarUpload } from "../../middlewares/avatarUpload.middleware.js";
import { resumeUpload } from "../../middlewares/resumeUpload.middleware.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";

import {
  createMyProfileController,
  deleteAvatarController,
  deleteResumeController,
  getProfileController,
  getResumeController,
  updateMyProfileController,
  uploadAvatarController,
  uploadResumeController,
} from "./profile.controller.js";
import { profileValidation } from "./profile.validation.js";

const router: Router = Router();

router.get("/me", protect, getProfileController);

router.post("/", protect, profileValidation, validate, createMyProfileController);

router.put("/me", protect, profileValidation, validate, updateMyProfileController);

router.patch("/me/resume", protect, resumeUpload.single("resume"), uploadResumeController);

router.get("/me/resume", protect, getResumeController);

router.delete("/me/resume", protect, deleteResumeController);

router.patch("/me/avatar", protect, avatarUpload.single("avatar"), uploadAvatarController);

router.delete("/me/avatar", protect, deleteAvatarController);

export default router;
