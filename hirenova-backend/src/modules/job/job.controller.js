import { asyncHandler } from "../../utils/asyncHandler.util.js";
import {
  createJobService,
  getMyJobsService,
  getAllJobsService,
  getJobByIdService,
  deleteJobService,
  getRecommendedJobsService,
} from "./job.service.js";

export const createJob = asyncHandler(async (req, res) => {
  const job = await createJobService(req.body, req.user._id);

  res.status(201).json({
    success: true,
    job,
  });
});

export const getMyJobs = asyncHandler(async (req, res) => {
  const jobs = await getMyJobsService(req.user._id);
  res.status(200).json({
    success: true,
    jobs,
  });
});

export const getJobs = asyncHandler(async (req, res) => {
  const result = await getAllJobsService(req.query);

  res.json({
    success: true,
    ...result,
  });
});

export const getJobById = asyncHandler(async (req, res) => {
  const job = await getJobByIdService(req.params.id);

  res.json({
    success: true,
    job,
  });
});

export const deleteJob = asyncHandler(async (req, res) => {
  await deleteJobService(req.params.id);

  res.json({
    success: true,
    message: "Job deleted",
  });
});

export const getRecommendedJobs = asyncHandler(async (req, res) => {
  const jobs = await getRecommendedJobsService(req.user._id);

  res.status(200).json({
    success: true,
    jobs,
  });
});
