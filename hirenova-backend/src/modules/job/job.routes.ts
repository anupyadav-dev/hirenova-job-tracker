import { Router } from "express";

import { protect, authorize } from "../../middlewares/auth.middleware.js";
import { zodValidate } from "../../shared/validators/validate.middleware.js";

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
import {
  createJobSchema,
  getAllJobsQuerySchema,
  updateJobSchema,
} from "./job.schemas.js";

const router: Router = Router();

router.get("/latest", getLatestJobs);
router.get("/recommended", protect, getRecommendedJobs);
router.get("/my/jobs", protect, authorize("recruiter"), getMyJobs);

// Validate query params for the public jobs listing
router.get("/", zodValidate(getAllJobsQuerySchema, "query"), getJobs);
router.get("/:id", getJobById);

router.post(
  "/",
  protect,
  authorize("recruiter"),
  zodValidate(createJobSchema),
  createJob,
);

// Update validates a partial schema — only provided fields are checked
router.put("/:id", protect, authorize("recruiter"), zodValidate(updateJobSchema), updateJob);
router.delete("/:id", protect, authorize("recruiter"), deleteJob);

export default router;
