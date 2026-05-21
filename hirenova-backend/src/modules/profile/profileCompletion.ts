import type { IProfile } from "./profile.model.js";

export interface ProfileCompletion {
  percentage: number;
  missing: string[];
  completed: boolean;
}

export const calculateProfileCompletion = (
  profile: IProfile,
): ProfileCompletion => {
  let score = 0;
  const missing: string[] = [];

  if (profile.bio?.trim()) {
    score += 15;
  } else {
    missing.push("Add bio");
  }

  if (profile.skills?.length >= 1) {
    score += 20;
  } else {
    missing.push("Add skills");
  }

  if (profile.experience?.trim()) {
    score += 15;
  } else {
    missing.push("Add experience");
  }

  if (profile.phone?.trim()) {
    score += 10;
  } else {
    missing.push("Add phone number");
  }

  // profile.profileImage is always an object { url, publicId } per the schema.
  // The original JS checked `.trim?.()` as a guard for a legacy string shape
  // that this schema never produces — TypeScript migration confirmed it is dead
  // code (objects have no .trim()). The meaningful check is .url.
  if (profile.profileImage?.url) {
    score += 20;
  } else {
    missing.push("Add profile image");
  }

  // Same reasoning: resume.url is the canonical presence check.
  if (profile.resume?.url) {
    score += 20;
  } else {
    missing.push("Upload resume");
  }

  return {
    percentage: score,
    missing,
    completed: score === 100,
  };
};
