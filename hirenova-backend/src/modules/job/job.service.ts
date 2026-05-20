import type { AnyObject, SortOrder } from "mongoose";

import { parsePagination, calcPages } from "../../shared/helpers/pagination.helper.js";
import type { PaginatedResult, PaginationQuery } from "../../shared/types/pagination.types.js";
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

// PaginationQuery (page/limit) comes from shared/; job-specific filter fields
// are extended here — adding them to the shared type would couple it to job.
export interface GetAllJobsQuery extends PaginationQuery {
  keyword?: string;
  location?: string;
  jobType?: string;
  category?: string;
  minSalary?: string;
  maxSalary?: string;
  experience?: string;
  sort?: string;
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
  query: PaginationQuery,
): Promise<PaginatedResult<JobDocument>> => {
  const { pageNum, limitNum, skip } = parsePagination(query, 6);

  const [items, total] = await Promise.all([
    Job.find({ createdBy: userId }).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    Job.countDocuments({ createdBy: userId }),
  ]);

  return { items, total, page: pageNum, pages: calcPages(total, limitNum) };
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
): Promise<PaginatedResult<JobDocument>> => {
  const {
    keyword,
    location,
    jobType,
    category,
    minSalary,
    maxSalary,
    experience,
    sort = "latest",
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

  const { pageNum, limitNum, skip } = parsePagination(query, 6);

  const [items, total] = await Promise.all([
    Job.find(filter).sort(sortOption).skip(skip).limit(limitNum),
    Job.countDocuments(filter),
  ]);

  return { items, total, page: pageNum, pages: calcPages(total, limitNum) };
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
