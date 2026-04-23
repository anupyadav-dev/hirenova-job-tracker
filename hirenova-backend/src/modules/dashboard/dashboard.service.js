import Job from "../job/job.model.js";
import Application from "../application/application.model.js";

export const getRecruiterDashboardService = async (recruiterId) => {
  const jobs = await Job.find({ createdBy: recruiterId });

  const jobIds = jobs.map((job) => job._id);

  const totalJobs = jobs.length;

  const totalApplications = await Application.countDocuments({
    job: { $in: jobIds },
  });

  const applicationsPerJob = await Application.aggregate([
    {
      $match: {
        job: { $in: jobIds },
      },
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
        as: "jobInfo",
      },
    },
    {
      $unwind: "$jobInfo",
    },
    {
      $project: {
        _id: 0,
        jobTitle: "$jobInfo.title",
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
