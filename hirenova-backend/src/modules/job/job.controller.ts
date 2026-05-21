import type { RequestHandler } from "express";

import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.util.js";

import {
  createJobService,
  deleteJobService,
  getAllJobsService,
  getJobByIdService,
  getLatestJobsService,
  getMyJobsService,
  getRecommendedJobsService,
  updateJobService,
} from "./job.service.js";
import type {
  CreateJobInput,
  UpdateJobInput,
  GetAllJobsInput,
} from "./job.schemas.js";

// ─── Public routes (no req.user access) ──────────────────────────────────────

export const getJobs: RequestHandler = asyncHandler(async (req, res) => {
  // zodValidate(getAllJobsQuerySchema, "query") runs before this handler and
  // writes the parsed result back to req.query — so the cast is proven, not blind.
  // All numeric fields (page, limit, minSalary, maxSalary, experience) are
  // already coerced; enum fields (jobType, category, sort) are already validated.
  // Double-cast through unknown: zodValidate proved req.query matches
  // GetAllJobsInput at runtime (coerced numbers, validated enums, defaults
  // applied). ParsedQs and GetAllJobsInput don't statically overlap enough
  // for a single `as` — `as unknown as T` is the approved TypeScript pattern
  // for "I have runtime proof the types align".
  const result = await getAllJobsService(req.query as unknown as GetAllJobsInput);
  res.json(new ApiResponse(200, "Jobs fetched", result));
});

export const getJobById: RequestHandler = asyncHandler(async (req, res) => {
  const job = await getJobByIdService(req.params.id as string);
  res.json(new ApiResponse(200, "Job fetched", job));
});

export const getLatestJobs: RequestHandler = asyncHandler(async (_req, res) => {
  const jobs = await getLatestJobsService();
  res.json(new ApiResponse(200, "Latest jobs", jobs));
});

// ─── Protected routes (req.user._id required) ────────────────────────────────

export const createJob: RequestHandler = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Not authenticated");
  }

  const job = await createJobService(req.body as CreateJobInput, req.user._id);

  res.status(201).json(new ApiResponse(201, "Job created", job));
});

export const getMyJobs: RequestHandler = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Not authenticated");
  }

  const { page, limit } = req.query;

  const jobs = await getMyJobsService(req.user._id, {
    page: page as string | undefined,
    limit: limit as string | undefined,
  });

  res.json(new ApiResponse(200, "My jobs", jobs));
});

export const updateJob: RequestHandler = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Not authenticated");
  }

  const job = await updateJobService(
    req.params.id as string,
    req.user._id,
    req.body as UpdateJobInput,
  );

  res.json(new ApiResponse(200, "Job updated", job));
});

export const deleteJob: RequestHandler = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Not authenticated");
  }

  await deleteJobService(req.params.id as string, req.user._id);

  res.json(new ApiResponse(200, "Job deleted"));
});

export const getRecommendedJobs: RequestHandler = asyncHandler(
  async (req, res) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated");
    }

    const jobs = await getRecommendedJobsService(req.user._id);

    res.json(new ApiResponse(200, "Recommended jobs", jobs));
  },
);
