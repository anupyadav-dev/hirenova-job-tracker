import express from "express";

import {
  getMeController,
  getAllUsersController,
  updateUserStatusController,
} from "./user.controller.js";

import { protect, authorize } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/me", protect, getMeController);

router.get("/", protect, authorize("admin"), getAllUsersController);

router.patch(
  "/:id/status",
  protect,
  authorize("admin"),
  updateUserStatusController,
);

export default router;
