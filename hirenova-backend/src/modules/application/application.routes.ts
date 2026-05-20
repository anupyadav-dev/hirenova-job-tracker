import { Router } from "express";

import { protect, authorize } from "../../middlewares/auth.middleware.js";

import {
  applyJob,
  getApplicants,
  getMyApplications,
  updateApplicationStatus,
  withdrawApplication,
} from "./application.controller.js";

const router: Router = Router();

// user routes
router.post("/:jobId/apply", protect, authorize("user"), applyJob);
router.get("/my", protect, authorize("user"), getMyApplications);
router.delete("/:id", protect, authorize("user"), withdrawApplication);

// recruiter routes
router.get("/job/:jobId", protect, authorize("recruiter"), getApplicants);
router.patch(
  "/:id/status",
  protect,
  authorize("recruiter"),
  updateApplicationStatus,
);

export default router;
