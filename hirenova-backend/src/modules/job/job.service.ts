import type { AnyObject, SortOrder } from "mongoose";

import { parsePagination, calcPages } from "../../shared/helpers/pagination.helper.js";
import type { PaginatedResult, PaginationQuery } from "../../shared/types/pagination.types.js";
import { ApiError } from "../../utils/apiError.js";
import Application from "../application/application.model.js";

import Job from "./job.model.js";
import type { JobDocument } from "./job.model.js";
import type {
  CreateJobInput,
  UpdateJobInput,
  GetAllJobsInput,
} from "./job.schemas.js";


// ─── Services ─────────────────────────────────────────────────────────────────

export const createJobService = async (
  data: CreateJobInput,
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
  data: UpdateJobInput,
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
  query: GetAllJobsInput,
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
    sort,
  } = query;
  // sort always has a value — Zod schema defaults to "latest"

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

  // jobType and category arrive as their enum literal types from Zod (not raw
  // strings), so no cast needed. Invalid values are rejected at the route level.
  if (jobType) filter.jobType = jobType;
  if (category) filter.category = category;

  // minSalary / maxSalary are already coerced to numbers by Zod (z.coerce.number).
  // Use !== undefined instead of truthiness to preserve a hypothetical $0 filter.
  if (minSalary !== undefined || maxSalary !== undefined) {
    const salaryFilter: { $gte?: number; $lte?: number } = {};
    if (minSalary !== undefined) salaryFilter.$gte = minSalary;
    if (maxSalary !== undefined) salaryFilter.$lte = maxSalary;
    filter.salary = salaryFilter;
  }

  if (experience !== undefined) {
    // Dot-notation keys are valid MongoDB but not part of IJob's TypeScript
    // interface. Object.assign bypasses the strict key check; behaviour is
    // identical to the original JS code. experience is a coerced number.
    Object.assign(filter, {
      "experience.min": { $lte: experience },
      "experience.max": { $gte: experience },
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
