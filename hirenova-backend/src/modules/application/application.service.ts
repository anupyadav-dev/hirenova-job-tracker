import mongoose, { type Types } from "mongoose";

import { calcPages, parsePagination } from "../../shared/helpers/pagination.helper.js";
import type { PaginatedResult, PaginationQuery } from "../../shared/types/pagination.types.js";
import { ApiError } from "../../utils/apiError.js";
import Job from "../job/job.model.js";

import Application from "./application.model.js";
import type {
  ApplicationDocument,
  ApplicationStatus,
} from "./application.model.js";

// ─── Input shapes ─────────────────────────────────────────────────────────────

export interface ApplyJobData {
  resume?: {
    url?: string;
    name?: string;
  };
  coverLetter?: string;
}

// ─── Services ─────────────────────────────────────────────────────────────────

export const applyJobService = async (
  jobId: string,
  userId: string,
  data: ApplyJobData,
): Promise<ApplicationDocument> => {
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

    // create() with a 1-element array always returns exactly 1 document
    // (or throws before returning). The `!` asserts the element is present;
    // Mongoose would have thrown if the insert failed.
    return application[0]!;
  } catch (err: unknown) {
    await session.abortTransaction();
    session.endSession();

    // E11000: unique index violation — (job, applicant) pair already exists.
    // Same structural narrowing pattern used in error.middleware.ts.
    if ((err as { code?: number }).code === 11000) {
      throw new ApiError(400, "Already applied");
    }

    throw err;
  }
};

export const getMyApplicationsService = async (userId: string) => {
  return Application.find({ applicant: userId })
    .populate("job", "title company location salary status")
    .sort({ createdAt: -1 });
};

export const getApplicantsService = async (
  jobId: string,
  recruiterId: string,
  query: PaginationQuery,
): Promise<PaginatedResult<ApplicationDocument>> => {
  const job = await Job.findById(jobId);

  if (!job) throw new ApiError(404, "Job not found");

  if (job.createdBy.toString() !== recruiterId.toString()) {
    throw new ApiError(403, "Not authorized");
  }

  const { pageNum, limitNum, skip } = parsePagination(query, 10);

  const [items, total] = await Promise.all([
    Application.find({ job: jobId })
      .populate("applicant", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Application.countDocuments({ job: jobId }),
  ]);

  return { items, total, page: pageNum, pages: calcPages(total, limitNum) };
};

export const updateApplicationStatusService = async (
  applicationId: string,
  recruiterId: string,
  status: ApplicationStatus,
): Promise<ApplicationDocument> => {
  const validStatus: ApplicationStatus[] = ["reviewed", "accepted", "rejected"];

  if (!validStatus.includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const application = await Application.findById(applicationId).populate("job");

  if (!application) throw new ApiError(404, "Application not found");

  // After .populate("job"), the `job` field is the full document at runtime,
  // but TypeScript still types it as ObjectId (IApplication.job: Types.ObjectId).
  // Job model is still JS — declare only the field we need here.
  const populatedJob = application.job as unknown as {
    createdBy: Types.ObjectId;
  };

  if (populatedJob.createdBy.toString() !== recruiterId.toString()) {
    throw new ApiError(403, "Not authorized");
  }

  application.status = status;

  if (status === "reviewed") {
    application.reviewedAt = new Date();
  }

  await application.save();

  return application;
};

export const withdrawApplicationService = async (
  applicationId: string,
  userId: string,
): Promise<void> => {
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
  } catch (err: unknown) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};
