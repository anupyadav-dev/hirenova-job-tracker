import type { RequestHandler } from "express";

import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.util.js";
import type { ApplicationStatus } from "./application.model.js";

import {
  applyJobService,
  getApplicantsService,
  getMyApplicationsService,
  updateApplicationStatusService,
  withdrawApplicationService,
  type ApplyJobData,
} from "./application.service.js";

export const applyJob: RequestHandler = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Not authenticated");
  }

  const app = await applyJobService(
    req.params.jobId as string,
    req.user._id,
    req.body as ApplyJobData,
  );

  res.status(201).json(new ApiResponse(201, "Applied successfully", app));
});

export const getMyApplications: RequestHandler = asyncHandler(
  async (req, res) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated");
    }

    const apps = await getMyApplicationsService(req.user._id);

    res.json(new ApiResponse(200, "Applications fetched", apps));
  },
);

export const getApplicants: RequestHandler = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Not authenticated");
  }

  // Extract only the fields the service needs — req.query (ParsedQs) can
  // contain nested objects; narrow to the expected string shape here.
  const { page, limit } = req.query;

  const apps = await getApplicantsService(
    req.params.jobId as string,
    req.user._id,
    {
      page: page as string | undefined,
      limit: limit as string | undefined,
    },
  );

  res.json(new ApiResponse(200, "Applicants fetched", apps));
});

export const updateApplicationStatus: RequestHandler = asyncHandler(
  async (req, res) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated");
    }

    const app = await updateApplicationStatusService(
      req.params.id as string,
      req.user._id,
      req.body.status as ApplicationStatus,
    );

    res.json(new ApiResponse(200, "Status updated", app));
  },
);

export const withdrawApplication: RequestHandler = asyncHandler(
  async (req, res) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated");
    }

    await withdrawApplicationService(req.params.id as string, req.user._id);

    res.json(new ApiResponse(200, "Application withdrawn"));
  },
);
