import Application from "./application.model.js";
import Job from "../job/job.model.js";
import { ApiError } from "../../utils/apiError.js";


export const applyJobService = async (jobId, userId) => {
  const job = await Job.findById(jobId);

  if (!job || !job.isActive) {
    throw new ApiError(404, "Job not found or inactive");
  }

  
  if (job.createdBy.toString() === userId.toString()) {
    throw new ApiError(400, "You cannot apply to your own job");
  }

  const exists = await Application.findOne({
    job: jobId,
    applicant: userId,
  });

  if (exists) {
    throw new ApiError(400, "Already applied");
  }

  return await Application.create({
    job: jobId,
    applicant: userId,
  });
};


export const getMyApplicationsService = async (userId) => {
  return await Application.find({ applicant: userId })
    .populate("job", "title company location salary")
    .sort({ createdAt: -1 });
};


export const getApplicantsService = async (jobId, recruiterId) => {
  const job = await Job.findById(jobId);

  if (!job) throw new ApiError(404, "Job not found");

  if (job.createdBy.toString() !== recruiterId.toString()) {
    throw new ApiError(403, "Not authorized");
  }

  return await Application.find({ job: jobId })
    .populate("applicant", "name email")
    .sort({ createdAt: -1 });
};


export const updateApplicationStatusService = async (
  applicationId,
  recruiterId,
  status,
) => {
  const validStatus = ["reviewed", "accepted", "rejected"];

  if (!validStatus.includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const application = await Application.findById(applicationId).populate("job");

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  if (application.job.createdBy.toString() !== recruiterId.toString()) {
    throw new ApiError(403, "Not authorized");
  }

  application.status = status;

  await application.save();

  return application;
};


export const withdrawApplicationService = async (applicationId, userId) => {
  const application = await Application.findById(applicationId);

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  if (application.applicant.toString() !== userId.toString()) {
    throw new ApiError(403, "Not allowed");
  }

  await application.deleteOne();
};
