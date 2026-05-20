import { Router } from "express";

import { protect, authorize } from "../../middlewares/auth.middleware.js";

import {
  deleteJob,
  getAllJobs,
  getAllRecruiters,
  getAllUsers,
  updateUserStatus,
} from "./admin.controller.js";

const router: Router = Router();

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
