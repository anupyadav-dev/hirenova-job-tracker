import mongoose from "mongoose";
import Application from "./application.model.js";
import Job from "../job/job.model.js";
import { ApiError } from "../../utils/apiError.js";

export const applyJobService = async (jobId, userId, data) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const job = await Job.findById(jobId).session(session);

    if (!job || job.status !== "active") {
      throw new ApiError(404, "Job not found or inactive");
    }

    if (job.createdBy.toString() === userId.toString()) {
      throw new ApiError(400, "You cannot apply to your own job");
    }

    const application = await Application.create(
      [
        {
          job: jobId,
          applicant: userId,
          resume: data?.resume,
          coverLetter: data?.coverLetter,
        },
      ],
      { session },
    );

    await Job.findByIdAndUpdate(
      jobId,
      { $inc: { applicationsCount: 1 } },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return application[0];
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    if (err.code === 11000) {
      throw new ApiError(400, "Already applied");
    }

    throw err;
  }
};

export const getMyApplicationsService = async (userId) => {
  return await Application.find({ applicant: userId })
    .populate("job", "title company location salary status")
    .sort({ createdAt: -1 });
};

export const getApplicantsService = async (jobId, recruiterId, query) => {
  const { page = 1, limit = 10 } = query;

  const job = await Job.findById(jobId);

  if (!job) throw new ApiError(404, "Job not found");

  if (job.createdBy.toString() !== recruiterId.toString()) {
    throw new ApiError(403, "Not authorized");
  }

  const skip = (page - 1) * limit;

  const applications = await Application.find({ job: jobId })
    .populate("applicant", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Application.countDocuments({ job: jobId });

  return {
    applications,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
  };
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

  if (!application) throw new ApiError(404, "Application not found");

  if (application.job.createdBy.toString() !== recruiterId.toString()) {
    throw new ApiError(403, "Not authorized");
  }

  application.status = status;

  if (status === "reviewed") {
    application.reviewedAt = new Date();
  }

  await application.save();

  return application;
};

export const withdrawApplicationService = async (applicationId, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const application =
      await Application.findById(applicationId).session(session);

    if (!application) {
      throw new ApiError(404, "Application not found");
    }

    if (application.applicant.toString() !== userId.toString()) {
      throw new ApiError(403, "Not allowed");
    }

    await Application.deleteOne({ _id: applicationId }).session(session);

    await Job.findByIdAndUpdate(
      application.job,
      { $inc: { applicationsCount: -1 } },
      { session },
    );

    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};
