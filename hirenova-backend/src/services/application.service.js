const Application = require("../models/application.model");
const Job = require("../models/job.model");

exports.applyJob = async (jobId, userId) => {
  const job = await Job.findById(jobId);

  if (!job) {
    throw new Error("Job not found");
  }

  const existingApplication = await Application.findOne({
    job: jobId,
    user: userId,
  });

  if (existingApplication) {
    throw new Error("You have already applied for this job");
  }

  const application = await Application.create({
    job: jobId,
    user: userId,
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

exports.updateApplicationStatus = async (
  applicationId,
  recruiterId,
  status
) => {
  const application = await Application.findById(applicationId).populate("job");

  if (!application) {
    throw new Error("Application not found");
  }

  if (application.job.createdBy.toString() !== recruiterId) {
    throw new Error("Not authorized to update this application");
  }

  application.status = status;

  await application.save();

  return application;
};
