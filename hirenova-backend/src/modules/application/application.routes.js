import express from "express";
const router = express.Router();

import {
  applyJob,
  getMyApplications,
  getApplicants,
  updateApplicationStatus,
} from "./application.controller.js";
import { protect, authorize } from "../../middlewares/auth.middleware.js";

router.post("/apply/:jobId", protect, authorize("user"), applyJob);

router.get("/my-applications", protect, authorize("user"), getMyApplications);

router.get("/job/:jobId", protect, authorize("recruiter"), getApplicants);

router.patch(
  "/:applicationId/status",
  protect,
  authorize("recruiter"),
  updateApplicationStatus
);

export default router;
