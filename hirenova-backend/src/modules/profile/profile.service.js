import { Profile } from "./profile.model.js";
import { ApiError } from "../../utils/apiError.js";
import cloudinary from "../../utils/cloudinary.js";
import streamifier from "streamifier";

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "hirenova/resume",
        resource_type: "raw",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const normalizeSkills = (skills) => {
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

export const getProfileService = async (userId) => {
  const profile = await Profile.findOne({
    user: userId,
  }).populate("user", "name email role");

  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  return profile;
};

export const createProfileService = async (userId, data) => {
  const existing = await Profile.findOne({
    user: userId,
  });

  if (existing) {
    throw new ApiError(400, "Profile already exists");
  }

  const profile = await Profile.create({
    user: userId,
    bio: data.bio || "",
    experience: data.experience || "",
    phone: data.phone || "",
    skills: normalizeSkills(data.skills),
  });

  return profile;
};

export const updateProfileService = async (userId, data) => {
  const profile = await Profile.findOne({
    user: userId,
  });

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

export const uploadResumeService = async (userId, file) => {
  if (!file) {
    throw new ApiError(400, "Resume file is required");
  }

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    throw new ApiError(400, "Only PDF/DOC/DOCX allowed");
  }

  const profile = await Profile.findOne({
    user: userId,
  });

  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  if (profile.resume?.publicId) {
    await cloudinary.uploader.destroy(profile.resume.publicId, {
      resource_type: "raw",
    });
  }

  const result = await uploadToCloudinary(file.buffer);

  profile.resume = {
    url: result.secure_url,
    publicId: result.public_id,
    fileName: file.originalname,
    uploadedAt: new Date(),
  };

  await profile.save();

  return profile;
};

const uploadAvatarToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "hirenova/avatar",
        transformation: [
          {
            width: 300,
            height: 300,
            crop: "fill",
          },
          {
            quality: "auto",
          },
        ],
      },
      (error, result) => {
        if (error) return reject(error);

        resolve(result);
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const uploadAvatarService = async (userId, file) => {
  if (!file) {
    throw new ApiError(400, "Avatar file is required");
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.mimetype)) {
    throw new ApiError(400, "Only JPG PNG WEBP allowed");
  }

  const profile = await Profile.findOne({
    user: userId,
  });

  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  // Delete old avatar
  if (profile.profileImage?.publicId) {
    await cloudinary.uploader.destroy(profile.profileImage.publicId);
  }

  // Upload new avatar
  const result = await uploadAvatarToCloudinary(file.buffer);

  profile.profileImage = {
    url: result.secure_url,
    publicId: result.public_id,
  };

  await profile.save();

  return profile;
};

export const deleteAvatarService = async (userId) => {
  const profile = await Profile.findOne({
    user: userId,
  });

  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  if (!profile.profileImage?.publicId) {
    throw new ApiError(404, "Avatar not found");
  }

  await cloudinary.uploader.destroy(profile.profileImage.publicId);

  profile.profileImage = {
    url: "",
    publicId: "",
  };

  await profile.save();

  return profile;
};
