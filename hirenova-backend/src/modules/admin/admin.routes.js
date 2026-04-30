import express from "express";
import {
  getAllUsers,
  getAllJobs,
  getAllRecruiters,
  deleteJob,
  updateUserStatus,
} from "./admin.controller.js";

import { protect, authorize } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/users", protect, authorize("admin"), getAllUsers);
router.get("/jobs", protect, authorize("admin"), getAllJobs);
router.get("/recruiters", protect, authorize("admin"), getAllRecruiters);

router.delete("/jobs/:id", protect, authorize("admin"), deleteJob);

router.patch(
  "/users/:userId/status",
  protect,
  authorize("admin"),
  updateUserStatus,
);

export default router;
