import { asyncHandler } from "../../utils/asyncHandler.util.js";
import { ApiResponse } from "../../utils/apiResponse.js";

import {
  createJobService,
  getMyJobsService,
  getAllJobsService,
  getJobByIdService,
  deleteJobService,
  updateJobService,
  getRecommendedJobsService,
} from "./job.service.js";

export const createJob = asyncHandler(async (req, res) => {
  const job = await createJobService(req.body, req.user._id);

  res.status(201).json(new ApiResponse(201, "Job created", job));
});

export const getMyJobs = asyncHandler(async (req, res) => {
  const jobs = await getMyJobsService(req.user._id);

  res.json(new ApiResponse(200, "Jobs fetched", jobs));
});

export const updateJob = asyncHandler(async (req, res) => {
  const job = await updateJobService(req.params.id, req.user._id, req.body);

  res.json(new ApiResponse(200, "Job updated", job));
});

export const deleteJob = asyncHandler(async (req, res) => {
  await deleteJobService(req.params.id, req.user._id);

  res.json(new ApiResponse(200, "Job deleted"));
});

export const getJobs = asyncHandler(async (req, res) => {
  const result = await getAllJobsService(req.query);

  res.json(new ApiResponse(200, "Jobs fetched", result));
});

export const getJobById = asyncHandler(async (req, res) => {
  const job = await getJobByIdService(req.params.id);

  res.json(new ApiResponse(200, "Job fetched", job));
});

export const getRecommendedJobs = asyncHandler(async (req, res) => {
  const jobs = await getRecommendedJobsService(req.user._id);

  res.json(new ApiResponse(200, "Recommended jobs", jobs));
});
