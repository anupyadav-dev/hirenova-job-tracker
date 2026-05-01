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

router.post("/apply/:jobId", protect, authorize("user"), applyJob);

router.get("/my-applications", protect, authorize("user"), getMyApplications);

router.delete(
  "/:applicationId",
  protect,
  authorize("user"),
  withdrawApplication,
);

router.get("/job/:jobId", protect, authorize("recruiter"), getApplicants);

router.patch(
  "/:applicationId/status",
  protect,
  authorize("recruiter"),
  updateApplicationStatus,
);

export default router;
