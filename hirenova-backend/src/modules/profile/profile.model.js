import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
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
    },
  },
  { timestamps: true },
);

export const Profile = mongoose.model("Profile", profileSchema);
