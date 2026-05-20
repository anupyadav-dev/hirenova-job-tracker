import mongoose, { type HydratedDocument, type Model, type Types } from "mongoose";

// ─── Domain constants & unions ───────────────────────────────────────────────

export const APPLICATION_STATUSES = [
  "pending",
  "reviewed",
  "accepted",
  "rejected",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

// ─── Subdocument shapes ───────────────────────────────────────────────────────

interface ResumeFile {
  url?: string;
  name?: string;
}

// ─── Document interface ───────────────────────────────────────────────────────

export interface IApplication {
  job: Types.ObjectId;
  applicant: Types.ObjectId;
  status: ApplicationStatus;
  resume?: ResumeFile;
  coverLetter?: string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type ApplicationDocument = HydratedDocument<IApplication>;
export type ApplicationModelType = Model<IApplication>;

// ─── Schema ───────────────────────────────────────────────────────────────────

const applicationSchema = new mongoose.Schema<IApplication>(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },

    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: "pending",
      index: true,
    },

    resume: {
      url: String,
      name: String,
    },

    coverLetter: {
      type: String,
      trim: true,
    },

    reviewedAt: Date,
  },
  { timestamps: true },
);

applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

const Application = mongoose.model<IApplication>("Application", applicationSchema);
export default Application;
