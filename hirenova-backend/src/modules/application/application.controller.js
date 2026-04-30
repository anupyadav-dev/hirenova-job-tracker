import { asyncHandler } from "../../utils/asyncHandler.util.js";
import { ApiResponse } from "../../utils/apiResponse.js";

import {
  applyJobService,
  getMyApplicationsService,
  getApplicantsService,
  updateApplicationStatusService,
  withdrawApplicationService,
} from "./application.service.js";

export const applyJob = asyncHandler(async (req, res) => {
  const app = await applyJobService(req.params.jobId, req.user._id);

  res.status(201).json(new ApiResponse(201, "Applied successfully", app));
});

export const getMyApplications = asyncHandler(async (req, res) => {
  const apps = await getMyApplicationsService(req.user._id);

  res.json(new ApiResponse(200, "Applications fetched", apps));
});

export const getApplicants = asyncHandler(async (req, res) => {
  const apps = await getApplicantsService(req.params.jobId, req.user._id);

  res.json(new ApiResponse(200, "Applicants fetched", apps));
});

export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const app = await updateApplicationStatusService(
    req.params.applicationId,
    req.user._id,
    req.body.status,
  );

  res.json(new ApiResponse(200, "Status updated", app));
});

export const withdrawApplication = asyncHandler(async (req, res) => {
  await withdrawApplicationService(req.params.applicationId, req.user._id);

  res.json(new ApiResponse(200, "Application withdrawn"));
});
