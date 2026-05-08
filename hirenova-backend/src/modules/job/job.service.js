import Job from "./job.model.js";
import Application from "../application/application.model.js";
import { ApiError } from "../../utils/apiError.js";

export const createJobService = async (data, userId) => {
  return await Job.create({ ...data, createdBy: userId });
};

export const getMyJobsService = async (userId, query) => {
  const { page = 1, limit = 6 } = query;

  const skip = (page - 1) * limit;

  const jobs = await Job.find({ createdBy: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Job.countDocuments({ createdBy: userId });

  return {
    jobs,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
  };
};

export const updateJobService = async (jobId, userId, data) => {
  const job = await Job.findById(jobId);

  if (!job) throw new ApiError(404, "Job not found");

  if (job.createdBy.toString() !== userId.toString()) {
    throw new ApiError(403, "Not authorized");
  }

  Object.assign(job, data);
  await job.save();

  return job;
};

export const deleteJobService = async (jobId, userId) => {
  const job = await Job.findById(jobId);

  if (!job) throw new ApiError(404, "Job not found");

  if (job.createdBy.toString() !== userId.toString()) {
    throw new ApiError(403, "Not authorized");
  }

  job.status = "deleted";
  await job.save();
};

export const getJobByIdService = async (jobId) => {
  const job = await Job.findById(jobId).populate("createdBy", "name email");

  if (!job || job.status !== "active") {
    throw new ApiError(404, "Job not found");
  }

  return job;
};

export const getAllJobsService = async (query, userId) => {
  const {
    keyword,
    location,
    jobType,
    category,
    minSalary,
    maxSalary,
    experience,
    sort = "latest",
    page = 1,
    limit = 6,
  } = query;

  let filter = { status: "active" };

  if (keyword) {
    filter.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { skills: { $regex: keyword, $options: "i" } },
      { company: { $regex: keyword, $options: "i" } },
    ];
  }

  if (location) {
    filter.location = { $regex: location, $options: "i" };
  }

  if (jobType) filter.jobType = jobType;
  if (category) filter.category = category;

  if (minSalary || maxSalary) {
    filter.salary = {};
    if (minSalary) filter.salary.$gte = Number(minSalary);
    if (maxSalary) filter.salary.$lte = Number(maxSalary);
  }

  if (experience) {
    filter["experience.min"] = { $lte: Number(experience) };
    filter["experience.max"] = { $gte: Number(experience) };
  }

  if (userId) {
    const applications = await Application.find({ applicant: userId }).select(
      "job",
    );
    const appliedIds = applications.map((a) => a.job);
    filter._id = { $nin: appliedIds };
  }

  let sortOption = { createdAt: -1 };
  if (sort === "salary") sortOption = { salary: -1 };
  if (sort === "oldest") sortOption = { createdAt: 1 };

  const safePage = Math.max(1, Number(page));
  const safeLimit = Math.max(1, Number(limit));

  const skip = (safePage - 1) * safeLimit;

  const jobs = await Job.find(filter)
    .sort(sortOption)
    .skip(skip)
    .limit(safeLimit);

  const total = await Job.countDocuments(filter);

  return {
    jobs,
    total,
    page: safePage,
    pages: Math.ceil(total / safeLimit),
  };
};
export const getLatestJobsService = async () => {
  return await Job.find({ status: "active" }).sort({ createdAt: -1 }).limit(6);
};

export const getRecommendedJobsService = async (userId) => {
  const applications = await Application.find({ applicant: userId }).select(
    "job",
  );

  const appliedJobIds = applications.map((a) => a.job);

  if (!applications.length) {
    return await Job.find({ status: "active" })
      .sort({ createdAt: -1 })
      .limit(6);
  }

  const appliedJobs = await Job.find({
    _id: { $in: appliedJobIds },
  }).select("skills category");

  const skills = appliedJobs.flatMap((job) => job.skills || []);
  const categories = appliedJobs.map((job) => job.category);

  let jobs = await Job.find({
    status: "active",
    _id: { $nin: appliedJobIds },
    $or: [{ skills: { $in: skills } }, { category: { $in: categories } }],
  })
    .sort({ applicationsCount: -1 })
    .limit(6);

  if (!jobs.length) {
    jobs = await Job.find({
      status: "active",
      _id: { $nin: appliedJobIds },
    })
      .sort({ createdAt: -1 })
      .limit(6);
  }

  return jobs;
};
