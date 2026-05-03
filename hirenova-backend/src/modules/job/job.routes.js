import express from "express";
import {
  createJob,
  getMyJobs,
  getJobs,
  getJobById,
  deleteJob,
  updateJob,
  getLatestJobs,
  getRecommendedJobs,
} from "./job.controller.js";

import { protect, authorize } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { createJobValidation } from "./job.validation.js";

const router = express.Router();

router.get("/latest", getLatestJobs);
router.get("/recommended", protect, getRecommendedJobs);
router.get("/my/jobs", protect, authorize("recruiter"), getMyJobs);

router.get("/", getJobs);
router.get("/:id", getJobById);

router.post(
  "/",
  protect,
  authorize("recruiter"),
  createJobValidation,
  validate,
  createJob,
);

router.put("/:id", protect, authorize("recruiter"), updateJob);
router.delete("/:id", protect, authorize("recruiter"), deleteJob);

export default router;
