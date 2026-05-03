import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getJobById } from "../../features/jobs/jobSlice";

import ApplyButton from "../../components/jobs/ApplyButton";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import JobActions from "../../components/jobs/JobActions";

const JobDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { job, loading, error } = useSelector((state) => state.jobs);

  useEffect(() => {
    if (id) dispatch(getJobById(id));
  }, [dispatch, id]);

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} />;
  if (!job) return <ErrorState message="Job not found" />;

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* TOP CARD */}
        <div className="bg-white rounded-xl shadow p-5">
          <h1 className="text-2xl font-bold">{job.title}</h1>

          <p className="text-gray-600 mt-1">
            {job.company} • {job.location}
          </p>

          {/* META INFO */}
          <div className="flex flex-wrap gap-2 mt-4 text-sm">
            <span className="bg-gray-100 px-2 py-1 rounded">{job.jobType}</span>

            <span className="bg-gray-100 px-2 py-1 rounded">{job.status}</span>

            {job.experience && (
              <span className="bg-gray-100 px-2 py-1 rounded">
                {job.experience.min} - {job.experience.max} yrs
              </span>
            )}
          </div>

          {/* SALARY */}
          {job.salary && (
            <p className="mt-3 font-medium text-green-600">
              ₹ {job.salary.toLocaleString()} / year
            </p>
          )}

          {/* SKILLS */}
          {job.skills?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
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

          {/* APPLY BUTTON */}
          <div className="mt-5">
            <JobActions role={user?.role} job={job} />
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="font-semibold mb-3">Job Description</h2>

          <p className="text-gray-700 whitespace-pre-line leading-relaxed">
            {job.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
