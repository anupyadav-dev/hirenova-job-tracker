import { Router } from "express";

import { protect, authorize } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validation.middleware.js";

import {
  createJob,
  deleteJob,
  getJobById,
  getJobs,
  getLatestJobs,
  getMyJobs,
  getRecommendedJobs,
  updateJob,
} from "./job.controller.js";
import { createJobValidation } from "./job.validation.js";

const router: Router = Router();

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
