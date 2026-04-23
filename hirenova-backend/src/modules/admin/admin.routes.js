import express from "express";
const router = express.Router();

import {
  getAllUsers,
  getAllJobs,
  getAllRecruiters,
  deleteJob,
  updateUserStatus,
  getAdminDashboard,
} from "./admin.controller.js";
import { protect, authorize } from "../../middlewares/auth.middleware.js";

router.get("/users", protect, authorize("admin"), getAllUsers);
router.get("/jobs", protect, authorize("admin"), getAllJobs);
router.get("/recruiters", protect, authorize("admin"), getAllRecruiters);

router.delete("/jobs/:id", protect, authorize("admin"), deleteJob);
router.patch(
  "/users/:userId/status",
  protect,
  authorize("admin"),
  updateUserStatus
);

router.get("/dashboard", protect, authorize("admin"), getAdminDashboard);

export default router;
