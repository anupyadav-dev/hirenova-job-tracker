import express from "express";
const router = express.Router();
import {
  createJob,
  getMyJobs,
  getRecommendedJobs,
  deleteJob,
  getJobById,
  getJobs,
} from "./job.controller.js";
import { protect, authorize } from "../../middlewares/auth.middleware.js";
import { createJobValidation } from "./job.validation.js";
import { validate } from "../../middlewares/validation.middleware.js";

router.post(
  "/",
  protect,
  authorize("recruiter"),
  createJobValidation,
  validate,
  createJob
);
router.get("/my-jobs", protect, authorize("recruiter"), getMyJobs);
router.get("/recommended", protect, authorize("user"), getRecommendedJobs);
router.get("/", getJobs);

router.get("/:id", getJobById);
router.delete("/:id", protect, authorize("recruiter"), deleteJob);

export default router;
