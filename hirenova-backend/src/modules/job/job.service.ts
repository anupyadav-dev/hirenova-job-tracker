import type { AnyObject, SortOrder } from "mongoose";

import { ApiError } from "../../utils/apiError.js";
import Application from "../application/application.model.js";

import Job from "./job.model.js";
import type {
  JobCategory,
  JobDocument,
  JobType,
} from "./job.model.js";

// ─── Input shapes ─────────────────────────────────────────────────────────────

export interface CreateJobData {
  title: string;
  description: string;
  company: string;
  location: string;
  salary?: number;
  jobType?: JobType;
  skills?: string[];
  category?: JobCategory;
  experience?: { min?: number; max?: number };
}

export type UpdateJobData = Partial<CreateJobData>;

export interface GetMyJobsQuery {
  page?: string | number;
  limit?: string | number;
}

export interface GetAllJobsQuery {
  keyword?: string;
  location?: string;
  jobType?: string;
  category?: string;
  minSalary?: string;
  maxSalary?: string;
  experience?: string;
  sort?: string;
  page?: string | number;
  limit?: string | number;
}

// ─── Output shapes ────────────────────────────────────────────────────────────

export interface JobsPage {
  jobs: JobDocument[];
  total: number;
  page: number;
  pages: number;
}

// ─── Services ─────────────────────────────────────────────────────────────────

export const createJobService = async (
  data: CreateJobData,
  userId: string,
): Promise<JobDocument> => {
  return Job.create({ ...data, createdBy: userId });
};

export const getMyJobsService = async (
  userId: string,
  query: GetMyJobsQuery,
): Promise<JobsPage> => {
  const { page = 1, limit = 6 } = query;

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const jobs = await Job.find({ createdBy: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const total = await Job.countDocuments({ createdBy: userId });

  return {
    jobs,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
  };
};

export const updateJobService = async (
  jobId: string,
  userId: string,
  data: UpdateJobData,
): Promise<JobDocument> => {
  const job = await Job.findById(jobId);

  if (!job) throw new ApiError(404, "Job not found");

  if (job.createdBy.toString() !== userId.toString()) {
    throw new ApiError(403, "Not authorized");
  }

  Object.assign(job, data);
  await job.save();

  return job;
};

export const deleteJobService = async (
  jobId: string,
  userId: string,
): Promise<void> => {
  const job = await Job.findById(jobId);

  if (!job) throw new ApiError(404, "Job not found");

  if (job.createdBy.toString() !== userId.toString()) {
    throw new ApiError(403, "Not authorized");
  }

  job.status = "deleted";
  await job.save();
};

export const getJobByIdService = async (
  jobId: string,
): Promise<JobDocument> => {
  const job = await Job.findById(jobId).populate("createdBy", "name email");

  if (!job || job.status !== "active") {
    throw new ApiError(404, "Job not found");
  }

  return job;
};

export const getAllJobsService = async (
  query: GetAllJobsQuery,
  // Optional: when provided, already-applied jobs are excluded from results.
  userId?: string,
): Promise<JobsPage> => {
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

  // AnyObject is Mongoose 9's exported type for loose filter objects.
  // Mongoose 9 removed FilterQuery; QueryFilter is internal. AnyObject lets
  // us build the filter incrementally (dot-notation, $or, etc.) while still
  // passing to Job.find() — the model's generic enforces document shape there.
  const filter: AnyObject = { status: "active" as const };

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

  // Values arrive as plain strings from req.query; cast to the schema enum
  // type — invalid values will simply return no results (Mongo filter miss).
  if (jobType) filter.jobType = jobType as JobType;
  if (category) filter.category = category as JobCategory;

  if (minSalary || maxSalary) {
    const salaryFilter: { $gte?: number; $lte?: number } = {};
    if (minSalary) salaryFilter.$gte = Number(minSalary);
    if (maxSalary) salaryFilter.$lte = Number(maxSalary);
    filter.salary = salaryFilter;
  }

  if (experience) {
    // Dot-notation keys are valid MongoDB but not part of IJob's TypeScript
    // interface. Object.assign bypasses the strict key check; behaviour is
    // identical to the original JS code.
    Object.assign(filter, {
      "experience.min": { $lte: Number(experience) },
      "experience.max": { $gte: Number(experience) },
    });
  }

  if (userId) {
    const applications = await Application.find({
      applicant: userId,
    }).select("job");
    const appliedIds = applications.map((a) => a.job);
    filter._id = { $nin: appliedIds };
  }

  let sortOption: Record<string, SortOrder> = { createdAt: -1 };
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

export const getLatestJobsService = async (): Promise<JobDocument[]> => {
  return Job.find({ status: "active" }).sort({ createdAt: -1 }).limit(6);
};

export const getRecommendedJobsService = async (
  userId: string,
): Promise<JobDocument[]> => {
  const applications = await Application.find({ applicant: userId }).select(
    "job",
  );

  const appliedJobIds = applications.map((a) => a.job);

  if (!applications.length) {
    return Job.find({ status: "active" }).sort({ createdAt: -1 }).limit(6);
  }

  const appliedJobs = await Job.find({
    _id: { $in: appliedJobIds },
  }).select("skills category");

  const skills = appliedJobs.flatMap((job) => job.skills ?? []);
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
