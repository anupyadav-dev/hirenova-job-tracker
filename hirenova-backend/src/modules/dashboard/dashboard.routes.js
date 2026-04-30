import express from "express";
import {
  getRecruiterDashboard,
  getAdminDashboard,
} from "./dashboard.controller.js";

import { protect, authorize } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
  "/recruiter",
  protect,
  authorize("recruiter"),
  getRecruiterDashboard,
);

router.get("/admin", protect, authorize("admin"), getAdminDashboard);

export default router;
