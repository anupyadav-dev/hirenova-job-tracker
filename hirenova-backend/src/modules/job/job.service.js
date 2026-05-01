import Job from "./job.model.js";
import Application from "../application/application.model.js";
import { ApiError } from "../../utils/apiError.js";

export const createJobService = async (data, userId) => {
  return await Job.create({
    ...data,
    createdBy: userId,
  });
};

export const getMyJobsService = async (userId, query) => {
  let { page = 1, limit = 6, keyword = "", location = "", status } = query;

  page = Number(page) || 1;
  limit = Number(limit) || 6;

  const filter = {
    createdBy: userId,
  };

  if (keyword) {
    filter.title = { $regex: keyword, $options: "i" };
  }

  if (location) {
    filter.location = { $regex: location, $options: "i" };
  }

  if (status) {
    filter.status = status; // active / closed
  }

  const total = await Job.countDocuments(filter);

  const pages = Math.ceil(total / limit) || 1;

  const safePage = Math.min(Math.max(page, 1), pages);

  const skip = (safePage - 1) * limit;

  const jobs = await Job.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    jobs,
    page: Number(safePage),
    pages,
    total,
  };
};

export const updateJobService = async (jobId, userId, data) => {
  const job = await Job.findById(jobId);

  if (!job) throw new ApiError(404, "Job not found");

  if (job.createdBy.toString() !== userId.toString()) {
    throw new ApiError(403, "Not authorized to update this job");
  }

  Object.assign(job, data);

  await job.save();

  return job;
};

export const deleteJobService = async (jobId, userId) => {
  const job = await Job.findById(jobId);

  if (!job) throw new ApiError(404, "Job not found");

  if (job.isDeleted) {
    throw new ApiError(400, "Job already deleted");
  }

  if (job.createdBy.toString() !== userId.toString()) {
    throw new ApiError(403, "Not authorized to delete this job");
  }

  job.isDeleted = true;
  job.status = "closed";
  job.isActive = false;
  job.deletedAt = new Date();

  await job.save();

  return job;
};

export const getJobByIdService = async (jobId) => {
  const job = await Job.findById(jobId).populate("createdBy", "name email");

  if (!job || !job.isActive) {
    throw new ApiError(404, "Job not found");
  }

  return job;
};

export const getAllJobsService = async (query) => {
  const {
    keyword,
    location,
    jobType,
    minSalary,
    maxSalary,
    page = 1,
    limit = 6,
    sort = "latest",
  } = query;

  let filter = { isActive: true };

  if (keyword) {
    filter.title = { $regex: keyword, $options: "i" };
  }

  if (location) {
    filter.location = { $regex: location, $options: "i" };
  }

  if (jobType) {
    filter.jobType = jobType;
  }

  if (minSalary || maxSalary) {
    filter.salary = {};
    if (minSalary) filter.salary.$gte = Number(minSalary);
    if (maxSalary) filter.salary.$lte = Number(maxSalary);
  }

  const skip = (page - 1) * limit;

  let sortOption = { createdAt: -1 };

  if (sort === "salary") {
    sortOption = { salary: -1 };
  }

  const jobs = await Job.find(filter)
    .sort(sortOption)
    .skip(skip)
    .limit(Number(limit))
    .populate("createdBy", "name email");

  const total = await Job.countDocuments(filter);

  return {
    jobs,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
  };
};

export const getRecommendedJobsService = async (userId) => {
  const applications = await Application.find({ user: userId }).populate("job");

  if (!applications.length) {
    return await Job.find({ isActive: true }).sort({ createdAt: -1 }).limit(6);
  }

  const keywords = applications.map((a) => a.job.title);

  return await Job.find({
    title: { $regex: keywords.join("|"), $options: "i" },
    isActive: true,
  })
    .sort({ createdAt: -1 })
    .limit(6);
};
