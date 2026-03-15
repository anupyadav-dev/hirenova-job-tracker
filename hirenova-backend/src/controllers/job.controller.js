const asyncHandler = require("../utils/asyncHandler.util");
const jobService = require("../services/job.service");

exports.createJob = asyncHandler(async (req, res) => {
  const job = await jobService.createJob(req.body, req.user._id);

  res.status(201).json({
    success: true,
    job,
  });
});

exports.getJobs = asyncHandler(async (req, res) => {
  const result = await jobService.getAllJobs(req.query);

  res.json({
    success: true,
    ...result,
  });
});

exports.getJobById = asyncHandler(async (req, res) => {
  const job = await jobService.getJobById(req.params.id);

  res.json({
    success: true,
    job,
  });
});

exports.deleteJob = asyncHandler(async (req, res) => {
  await jobService.deleteJob(req.params.id);

  res.json({
    success: true,
    message: "Job deleted",
  });
});
