import User from "../user/user.model.js";
import Job from "../job/job.model.js";
import Application from "../application/application.model.js";
import { ApiError } from "../../utils/apiError.js";

export const getAllUsersService = async () => {
  return await User.find({ role: "user" }).select("-password");
};

export const deleteJobService = async (jobId) => {
  return await Job.findByIdAndDelete(jobId);
};

export const getAllRecruitersService = async () => {
  const recruiters = await User.aggregate([
    {
      $match: { role: "recruiter" },
    },
    {
      $lookup: {
        from: "jobs",
        localField: "_id",
        foreignField: "createdBy",
        as: "jobs",
      },
    },
    {
      $addFields: {
        jobCount: { $size: "$jobs" },
      },
    },
    {
      $project: {
        name: 1,
        email: 1,
        jobCount: 1,
      },
    },
  ]);

  return recruiters;
};

export const getAllJobsService = async () => {
  return await Job.find().populate("createdBy", "name email");
};

export const updateUserStatusService = async (userId, status) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  user.status = status;

  await user.save();

  return user;
};

export const getAdminDashboardService = async () => {
  const totalUsers = await User.countDocuments({ role: "user" });
  const totalRecruiters = await User.countDocuments({ role: "recruiter" });
  const totalJobs = await Job.countDocuments();
  const totalApplications = await Application.countDocuments();

  return {
    totalUsers,
    totalRecruiters,
    totalJobs,
    totalApplications,
  };
};
