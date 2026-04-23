import Application from "./application.model.js";
import Job from "../job/job.model.js";
import { ApiError } from "../../utils/apiError.js";

export const applyJobService = async (jobId, userId) => {
  const job = await Job.findById(jobId);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  const existingApplication = await Application.findOne({
    job: jobId,
    applicant: userId,
  });

  if (existingApplication) {
    throw new ApiError(400, "You have already applied for this job");
  }

  const application = await Application.create({
    job: jobId,
    applicant: userId,
  });

  return application;
};

export const getMyApplicationsService = async (userId) => {
  return await Application.find({ applicant: userId })
    .populate("job", "title company location")
    .sort({ createdAt: -1 });
};

export const getApplicantsService = async (jobId) => {
  return await Application.find({ job: jobId }).populate(
    "applicant",
    "name email"
  );
};

export const updateApplicationStatusService = async (
  applicationId,
  recruiterId,
  status
) => {
  const application = await Application.findById(applicationId).populate("job");

  if (!application) {
    throw new Error("Application not found");
  }

  if (application.job.createdBy.toString() !== recruiterId) {
    throw new Error("Not authorized to update this application");
  }

  application.status = status;

  await application.save();

  return application;
};
