import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    bio: { type: String, default: "" },

    skills: [{ type: String }],

    experience: { type: String, default: "" },

    phone: { type: String, default: "" },

    profileImage: { type: String, default: "" },

    resume: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Profile = mongoose.model("Profile", profileSchema);
