import { useEffect, useState } from "react";
import axios from "../../api/axios";

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/admin/jobs");

      // IMPORTANT: backend should return jobs array
      setJobs(res.data.jobs || []);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (id) => {
    const confirmDelete = window.confirm("Delete this job?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/admin/jobs/${id}`);

      // safe state update
      setJobs((prev) => prev.filter((job) => job._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <p className="p-6">Loading jobs...</p>;

  if (!jobs.length) {
    return <p className="p-6">No jobs found</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Jobs (Admin)</h1>

      <div className="space-y-4">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            {/* LEFT SIDE */}
            <div>
              <h2 className="font-semibold text-lg">{job.title}</h2>
              <p className="text-sm text-gray-500">{job.location}</p>

              {/* 🔥 Recruiter info */}
              <p className="text-xs mt-1 text-blue-600">
                Posted by:{" "}
                <span className="font-medium">
                  {job.createdBy?.name || "Unknown Recruiter"}
                </span>
              </p>
            </div>

            {/* RIGHT SIDE */}
            <div>
              <button
                onClick={() => deleteJob(job._id)}
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

export default AllJobs;
