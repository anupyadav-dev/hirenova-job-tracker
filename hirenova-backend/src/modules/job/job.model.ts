import mongoose, { type HydratedDocument, type Model, type Types } from "mongoose";

// ─── Domain constants & unions ───────────────────────────────────────────────

export const JOB_TYPES = [
  "full-time",
  "part-time",
  "internship",
  "contract",
] as const;
export type JobType = (typeof JOB_TYPES)[number];

export const JOB_CATEGORIES = [
  "frontend",
  "backend",
  "fullstack",
  "devops",
] as const;
export type JobCategory = (typeof JOB_CATEGORIES)[number];

export const JOB_STATUSES = ["active", "closed", "deleted"] as const;
export type JobStatus = (typeof JOB_STATUSES)[number];

// ─── Document interface ───────────────────────────────────────────────────────

export interface IJob {
  title: string;
  description: string;
  company: string;
  location: string;
  salary?: number;
  jobType: JobType;
  skills: string[];
  category?: JobCategory;
  experience: {
    min: number;
    max: number;
  };
  applicationsCount: number;
  createdBy: Types.ObjectId;
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type JobDocument = HydratedDocument<IJob>;
export type JobModelType = Model<IJob>;

// ─── Schema ───────────────────────────────────────────────────────────────────

const jobSchema = new mongoose.Schema<IJob>(
  {
    title: { type: String, required: true, trim: true },

    description: { type: String, required: true },

    company: { type: String, required: true },

    location: { type: String, required: true },

    salary: Number,

    jobType: {
      type: String,
      enum: JOB_TYPES,
      default: "full-time",
    },

    skills: {
      type: [String],
      set: (skills: string[]) => skills.map((s) => s.toLowerCase().trim()),
    },

    category: {
      type: String,
      enum: JOB_CATEGORIES,
    },

    experience: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 1 },
    },

    applicationsCount: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: JOB_STATUSES,
      default: "active",
      index: true,
    },
  },
  { timestamps: true },
);

jobSchema.index({ createdAt: -1 });
jobSchema.index({ skills: 1 });
jobSchema.index({ category: 1 });

const Job = mongoose.model<IJob>("Job", jobSchema);
export default Job;
