import User from "../user/user.model.js";
import Job from "../job/job.model.js";
import { ApiError } from "../../utils/apiError.js";

export const getAllUsersService = async () => {
  return await User.find({ role: "user" }).select("-password");
};

export const getAllRecruitersService = async () => {
  return await User.find({ role: "recruiter" }).select("-password");
};

export const getAllJobsService = async () => {
  return await Job.find().populate("createdBy", "name email");
};

export const deleteJobService = async (jobId) => {
  const job = await Job.findById(jobId);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  job.isActive = false;
  await job.save();
};

export const updateUserStatusService = async (userId, status) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.status = status;
  await user.save();

  return user;
};
