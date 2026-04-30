import Job from "../job/job.model.js";
import Application from "../application/application.model.js";
import User from "../user/user.model.js";

export const getRecruiterDashboardService = async (userId) => {
  const totalJobs = await Job.countDocuments({ createdBy: userId });

  const jobs = await Job.find({ createdBy: userId }).select("_id");
  const jobIds = jobs.map((job) => job._id);

  const totalApplications = await Application.countDocuments({
    job: { $in: jobIds },
  });

  const applicationsPerJob = await Application.aggregate([
    {
      $match: { job: { $in: jobIds } },
    },
    {
      $group: {
        _id: "$job",
        applications: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "jobs",
        localField: "_id",
        foreignField: "_id",
        as: "job",
      },
    },
    { $unwind: "$job" },
    {
      $project: {
        _id: 0,
        jobTitle: "$job.title",
        applications: 1,
      },
    },
  ]);

  return {
    totalJobs,
    totalApplications,
    applicationsPerJob,
  };
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
