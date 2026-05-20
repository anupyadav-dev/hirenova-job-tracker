import { ApiError } from "../../utils/apiError.js";

import { Profile } from "./profile.model.js";
import type { ProfileDocument } from "./profile.model.js";

// ─── Input shapes ─────────────────────────────────────────────────────────────

export interface CreateProfileData {
  bio?: string;
  experience?: string;
  phone?: string;
  // Skills may arrive as a comma-separated string or a proper array
  // depending on the client. normalizeSkills handles both forms.
  skills?: string | string[];
}

export type UpdateProfileData = Partial<CreateProfileData>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const normalizeSkills = (
  skills: string | string[] | undefined | null,
): string[] => {
  if (!skills) return [];

  if (Array.isArray(skills)) return skills;

  if (typeof skills === "string") {
    return skills
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

// ─── Services ─────────────────────────────────────────────────────────────────

export const getProfileService = async (
  userId: string,
): Promise<ProfileDocument> => {
  const profile = await Profile.findOne({
    user: userId,
  }).populate("user", "name email role");

  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  return profile;
};

export const createProfileService = async (
  userId: string,
  data: CreateProfileData,
): Promise<ProfileDocument> => {
  const existing = await Profile.findOne({ user: userId });

  if (existing) {
    throw new ApiError(400, "Profile already exists");
  }

  const profile = await Profile.create({
    user: userId,
    bio: data.bio ?? "",
    experience: data.experience ?? "",
    phone: data.phone ?? "",
    skills: normalizeSkills(data.skills),
  });

  return profile;
};

export const updateProfileService = async (
  userId: string,
  data: UpdateProfileData,
): Promise<ProfileDocument> => {
  const profile = await Profile.findOne({ user: userId });

  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  if (data.bio !== undefined) profile.bio = data.bio;
  if (data.phone !== undefined) profile.phone = data.phone;
  if (data.experience !== undefined) profile.experience = data.experience;
  if (data.skills !== undefined) {
    profile.skills = normalizeSkills(data.skills);
  }

  await profile.save();

  return profile;
};
