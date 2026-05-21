import mongoose, { type HydratedDocument, type Model, type Types } from "mongoose";

// ─── Subdocument shapes ───────────────────────────────────────────────────────

export interface ProfileImageFile {
  url: string;
  publicId: string;
}

export interface ResumeFile {
  url: string;
  publicId: string;
  fileName: string;
  uploadedAt: Date | null;
}

// ─── Document interface ───────────────────────────────────────────────────────

export interface IProfile {
  user: Types.ObjectId;
  bio: string;
  skills: string[];
  experience: string;
  phone: string;
  profileImage: ProfileImageFile;
  resume: ResumeFile;
  createdAt: Date;
  updatedAt: Date;
}

export type ProfileDocument = HydratedDocument<IProfile>;
export type ProfileModelType = Model<IProfile>;

// ─── Schema ───────────────────────────────────────────────────────────────────

const profileSchema = new mongoose.Schema<IProfile>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    experience: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    profileImage: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },

    resume: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
      fileName: { type: String, default: "" },
      uploadedAt: { type: Date, default: null },
    },
  },
  { timestamps: true },
);

// Named export kept intentionally — matches the original `export const Profile`
// pattern so all existing imports stay unchanged.
export const Profile = mongoose.model<IProfile>("Profile", profileSchema);
