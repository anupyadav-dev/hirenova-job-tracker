const Application = require("../models/application.model");

exports.applyJob = async (jobId, userId) => {
  const application = await Application.create({
    job: jobId,
    applicant: userId,
  });

  return application;
};
