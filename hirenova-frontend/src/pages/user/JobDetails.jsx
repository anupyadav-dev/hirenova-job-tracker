import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getJobById } from "../../features/jobs/jobSlice";

import JobActions from "../../components/jobs/JobActions";

import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";

const JobDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { job, loading, error } = useSelector((state) => state.jobs);

  useEffect(() => {
    if (id) dispatch(getJobById(id));
  }, [dispatch, id]);

  // ================= STATES =================
  if (loading.job) return <Loader />;
  if (error.job) return <ErrorState message={error.job} />;
  if (!job) return <ErrorState message="Job not found" />;

  const role = user?.role || "guest";

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-6 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow p-5 md:p-6">
            <h1 className="text-xl md:text-2xl font-bold">{job.title}</h1>

            <p className="text-gray-600 mt-1 text-sm md:text-base">
              {job.company} • {job.location}
            </p>

            {/* TAGS */}
            <div className="flex flex-wrap gap-2 mt-3 text-xs md:text-sm">
              <span className="bg-gray-100 px-2 py-1 rounded">
                {job.jobType}
              </span>

              <span className="bg-gray-100 px-2 py-1 rounded">
                {job.status}
              </span>

              {job.experience && (
                <span className="bg-gray-100 px-2 py-1 rounded">
                  {job.experience.min} - {job.experience.max} yrs
                </span>
              )}
            </div>

            {job.salary && (
              <p className="mt-3 text-green-600 font-semibold">
                ₹ {job.salary.toLocaleString()} / year
              </p>
            )}

            {job.skills?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {job.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-5">
              <JobActions role={role} job={job} navigate={navigate} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-5 md:p-6">
            <h2 className="font-semibold mb-3">Job Description</h2>

            <p className="text-gray-700 whitespace-pre-line text-sm md:text-base">
              {job.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
