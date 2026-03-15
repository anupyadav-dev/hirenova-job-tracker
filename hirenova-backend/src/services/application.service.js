const Application = require("../models/application.model");

exports.applyJob = async (jobId, userId) => {
  const application = await Application.create({
    job: jobId,
    applicant: userId,
  });

  return application;
};

exports.getMyApplications = async (userId) => {
  return await Application.find({ applicant: userId }).populate("job");
};

exports.getApplicants = async (jobId) => {
  return await Application.find({ job: jobId }).populate(
    "applicant",
    "name email"
  );
};
