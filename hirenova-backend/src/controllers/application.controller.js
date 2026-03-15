const asyncHandler = require("../utils/asyncHandler.util");
const applicationService = require("../services/application.service");

exports.applyJob = asyncHandler(async (req, res) => {
  const application = await applicationService.applyJob(
    req.params.jobId,
    req.user._id
  );

  res.status(201).json({
    success: true,
    application,
  });
});
