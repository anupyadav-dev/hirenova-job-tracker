const User = require("../models/user.model");
const Job = require("../models/job.model");
const Application = require("../models/application.model");

exports.getAllUsers = async () => {
  return await User.find({ role: "user" }).select("-password");
};

exports.deleteJob = async (jobId) => {
  return await Job.findByIdAndDelete(jobId);
};

exports.getAllRecruiters = async () => {
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

exports.getAllJobs = async () => {
  return await Job.find().populate("createdBy", "name email");
};

exports.updateUserStatus = async (userId, status) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  user.status = status;

  await user.save();

  return user;
};

exports.getAdminDashboard = async () => {
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
