import { useEffect, useState } from "react";
import axios from "../../api/axios";

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await axios.get("/admin/jobs");
      setJobs(res.data.jobs);
    };

    fetchJobs();
  }, []);

  const deleteJob = async (id) => {
    await axios.delete(`/admin/jobs/${id}`);
    setJobs(jobs.filter((job) => job._id !== id));
  };

  return (
    <div className="p-6">
      <h1>All Jobs</h1>

      {jobs.map((job) => (
        <div key={job._id} className="border p-3 mb-2">
          <h2>{job.title}</h2>

          <button
            onClick={() => deleteJob(job._id)}
            className="bg-red-500 text-white px-3 py-1"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default AllJobs;
