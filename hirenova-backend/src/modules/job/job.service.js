import Job from "./job.model.js";
import Application from "../application/application.model.js";
import { ApiError } from "../../utils/apiError.js";

export const createJobService = async (jobData, userId) => {
  const job = await Job.create({
    ...jobData,
    createdBy: userId,
  });

  return job;
};

export const getMyJobsService = async (recruiterId) => {
  const job = await Job.find({ createdBy: recruiterId });

  return job;
};

export const getJobByIdService = async (jobId) => {
  const job = await Job.findById(jobId).populate("createdBy", "name email");
  if (!job) throw new ApiError(404, "Job not found");
  return job;
};

export const deleteJobService = async (jobId) => {
  return await Job.findByIdAndDelete(jobId);
};

export const getAllJobsService = async (query) => {
  const keyword = query.keyword
    ? {
        title: {
          $regex: query.keyword,
          $options: "i",
        },
      }
    : {};

  const location = query.location
    ? {
        location: {
          $regex: query.location,
          $options: "i",
        },
      }
    : {};

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 5;

  const skip = (page - 1) * limit;

  const jobs = await Job.find({
    ...keyword,
    ...location,
  })
    .skip(skip)
    .limit(limit)
    .populate("createdBy", "name email");

  const total = await Job.countDocuments({
    ...keyword,
    ...location,
  });

  return {
    jobs,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};

export const getRecommendedJobsService = async (userId) => {
  const applications = await Application.find({ user: userId }).populate("job");

  if (applications.length === 0) {
    return await Job.find().sort({ createdAt: -1 }).limit(5);
  }

  const titles = applications.map((app) => app.job.title);
  const locations = applications.map((app) => app.job.location);

  const recommendedJobs = await Job.find({
    $or: [
      {
        title: { $regex: titles.join("|"), $options: "i" },
      },
      {
        location: { $regex: locations.join("|"), $options: "i" },
      },
    ],
  })
    .sort({ createdAt: -1 })
    .limit(10);

  return recommendedJobs;
};
