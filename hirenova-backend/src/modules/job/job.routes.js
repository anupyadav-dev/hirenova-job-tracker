import express from "express";
import {
  createJob,
  getMyJobs,
  getJobs,
  getJobById,
  deleteJob,
  updateJob,
  getRecommendedJobs,
} from "./job.controller.js";

import { protect, authorize } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";
import { createJobValidation } from "./job.validation.js";

const router = express.Router();

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

router.get("/my/jobs", protect, authorize("recruiter"), getMyJobs);

router.put("/:id", protect, authorize("recruiter"), updateJob);

router.delete("/:id", protect, authorize("recruiter"), deleteJob);

router.get("/recommended", protect, getRecommendedJobs);

export default router;
