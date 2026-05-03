import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },

    description: { type: String, required: true },

    company: { type: String, required: true },

    location: { type: String, required: true },

    salary: Number,

    jobType: {
      type: String,
      enum: ["full-time", "part-time", "internship", "contract"],
      default: "full-time",
    },

    skills: {
      type: [String],
      set: (skills) => skills.map((s) => s.toLowerCase().trim()),
    },

    category: {
      type: String,
      enum: ["frontend", "backend", "fullstack", "devops"],
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
      enum: ["active", "closed", "deleted"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true },
);

jobSchema.index({ createdAt: -1 });
jobSchema.index({ skills: 1 });
jobSchema.index({ category: 1 });

export default mongoose.model("Job", jobSchema);
