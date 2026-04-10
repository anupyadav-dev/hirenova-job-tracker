import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyJobs, deleteJob } from "../../features/jobs/jobSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

const MyJobs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobs, loading } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(getMyJobs());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteJob(id));
      toast.success("Job deleted successfully");
    }
  };

  if (loading) return <Loader />;
  if (!jobs || jobs.length === 0) return <EmptyState message="No jobs found" />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Jobs</h1>
      <div className="grid gap-4">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="border p-4 flex justify-between items-center rounded shadow-sm"
          >
            <div>
              <h2 className="font-semibold">{job.title}</h2>
              <p className="text-sm text-gray-500">{job.location}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/recruiter/applicants/${job._id}`)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                View Applicants
              </button>
              <button
                onClick={() => handleDelete(job._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyJobs;
