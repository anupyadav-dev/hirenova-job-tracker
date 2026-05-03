import express from "express";
import {
  applyJob,
  getMyApplications,
  getApplicants,
  updateApplicationStatus,
  withdrawApplication,
} from "./application.controller.js";

import { protect, authorize } from "../../middlewares/auth.middleware.js";

const router = express.Router();

//  user routes
router.post("/:jobId/apply", protect, authorize("user"), applyJob);
router.get("/my", protect, authorize("user"), getMyApplications);
router.delete("/:id", protect, authorize("user"), withdrawApplication);

//  recruiter routes
router.get("/job/:jobId", protect, authorize("recruiter"), getApplicants);
router.patch(
  "/:id/status",
  protect,
  authorize("recruiter"),
  updateApplicationStatus,
);

export default router;
