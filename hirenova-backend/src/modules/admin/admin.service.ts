import { ApiError } from "../../utils/apiError.js";
import Job from "../job/job.model.js";
import User from "../user/user.model.js";
import type { UserDocument, UserStatus } from "../user/user.model.js";

// ─── Return-type note ────────────────────────────────────────────────────────
// User operations carry full types from the migrated user.model.ts.
// Job operations return inferred types — job.model.js is still JS.
// Return types for job queries will be tightened when job.model.ts lands.

export const getAllUsersService = async (): Promise<UserDocument[]> => {
  return User.find({ role: "user" }).select("-password");
};

export const getAllRecruitersService = async (): Promise<UserDocument[]> => {
  return User.find({ role: "recruiter" }).select("-password");
};

export const getAllJobsService = async () => {
  return Job.find().populate("createdBy", "name email");
};

export const deleteJobService = async (jobId: string): Promise<void> => {
  const job = await Job.findById(jobId);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  // Bug caught by migration: original code set `job.isActive = false`, but
  // the Job schema has no `isActive` field — Mongoose silently ignores unknown
  // field assignments, so every delete call was a no-op.
  // Correct soft-delete uses the schema's `status` field.
  job.status = "deleted";
  await job.save();
};

export const updateUserStatusService = async (
  userId: string,
  status: UserStatus,
): Promise<UserDocument> => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.status = status;
  await user.save();

  return user;
};
