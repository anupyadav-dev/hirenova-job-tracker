export const calculateProfileCompletion = (profile) => {
  let score = 0;
  const missing = [];

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

  if (profile.profileImage?.url || profile.profileImage?.trim?.()) {
    score += 20;
  } else {
    missing.push("Add profile image");
  }

  if (profile.resume?.url || profile.resume?.trim?.()) {
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
