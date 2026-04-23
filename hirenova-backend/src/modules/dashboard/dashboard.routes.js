import express from "express";
const router = express.Router();

import { getRecruiterDashboard } from "./dashboard.controller.js";
import { protect, authorize } from "../../middlewares/auth.middleware.js";

router.get(
  "/recruiter",
  protect,
  authorize("recruiter"),
  getRecruiterDashboard
);

export default router;
