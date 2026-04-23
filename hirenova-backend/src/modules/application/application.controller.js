import { asyncHandler } from "../../utils/asyncHandler.util.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import {
  applyJobService,
  getMyApplicationsService,
  getApplicantsService,
  updateApplicationStatusService,
} from "./application.service.js";

export const applyJob = asyncHandler(async (req, res) => {
  const jobId = req.params.jobId;
  const userId = req.user.id;

  const application = await applyJobService(jobId, userId);

  res.status(201).json({
    success: true,
    message: "Application submitted successfully",
    application,
  });
});

export const getMyApplications = asyncHandler(async (req, res) => {
  const apps = await getMyApplicationsService(req.user._id);

  res.json({
    success: true,
    applications: apps,
  });
});

export const getApplicants = asyncHandler(async (req, res) => {
  const apps = await getApplicantsService(req.params.jobId);

  res.json({
    success: true,
    applicants: apps,
  });
});

export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  const recruiterId = req.user.id;

  const application = await updateApplicationStatusService(
    applicationId,
    recruiterId,
    status
  );

  res.status(200).json({
    success: true,
    message: "Application status updated",
    application,
  });
});
