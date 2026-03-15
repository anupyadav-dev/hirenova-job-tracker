const Job = require("../models/job.model");

exports.createJob = async (jobData, userId) => {
  const job = await Job.create({
    ...jobData,
    createdBy: userId,
  });

  return job;
};

exports.getJobs = async () => {
  return await Job.find().populate("createdBy", "name email");
};

exports.getJobById = async (jobId) => {
  return await Job.findById(jobId).populate("createdBy", "name");
};

exports.deleteJob = async (jobId) => {
  return await Job.findByIdAndDelete(jobId);
};

exports.getAllJobs = async (query) => {
  const keyword = query.keyword
    ? {
        title: {
          $regex: query.keyword,
          $options: "i",
        },
      }
    : {};

  const location = query.location
    ? {
        location: {
          $regex: query.location,
          $options: "i",
        },
      }
    : {};

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 5;

  const skip = (page - 1) * limit;

  const jobs = await Job.find({
    ...keyword,
    ...location,
  })
    .skip(skip)
    .limit(limit)
    .populate("createdBy", "name email");

  const total = await Job.countDocuments({
    ...keyword,
    ...location,
  });

  return {
    jobs,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};
