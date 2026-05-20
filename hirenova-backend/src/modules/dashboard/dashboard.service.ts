import Application from "../application/application.model.js";
import Job from "../job/job.model.js";
import User from "../user/user.model.js";

// ─── Output shapes ───────────────────────────────────────────────────────────
// Aggregations don't infer; declare the expected row shape and pass it as a
// generic to `aggregate<T>(...)` so the rest of the function sees real types.

interface ApplicationsPerJobRow {
  jobTitle: string;
  applications: number;
}

export interface RecruiterDashboard {
  totalJobs: number;
  totalApplications: number;
  applicationsPerJob: ApplicationsPerJobRow[];
}

export interface AdminDashboard {
  totalUsers: number;
  totalRecruiters: number;
  totalJobs: number;
  totalApplications: number;
}

// ─── Services ────────────────────────────────────────────────────────────────

export const getRecruiterDashboardService = async (
  userId: string,
): Promise<RecruiterDashboard> => {
  const totalJobs = await Job.countDocuments({ createdBy: userId });

  const jobs = await Job.find({ createdBy: userId }).select("_id");
  const jobIds = jobs.map((job) => job._id);

  const totalApplications = await Application.countDocuments({
    job: { $in: jobIds },
  });

  const applicationsPerJob = await Application.aggregate<ApplicationsPerJobRow>(
    [
      { $match: { job: { $in: jobIds } } },
      {
        $group: {
          _id: "$job",
          applications: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: "$job" },
      {
        $project: {
          _id: 0,
          jobTitle: "$job.title",
          applications: 1,
        },
      },
    ],
  );

  return {
    totalJobs,
    totalApplications,
    applicationsPerJob,
  };
};

export const getAdminDashboardService = async (): Promise<AdminDashboard> => {
  const totalUsers = await User.countDocuments({ role: "user" });
  const totalRecruiters = await User.countDocuments({ role: "recruiter" });
  const totalJobs = await Job.countDocuments();
  const totalApplications = await Application.countDocuments();

  return {
    totalUsers,
    totalRecruiters,
    totalJobs,
    totalApplications,
  };
};
