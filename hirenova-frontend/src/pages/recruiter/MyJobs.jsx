import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await axios.get("/jobs/my-jobs");
      setJobs(res.data.jobs);
    };

    fetchJobs();
  }, []);

  return (
    <div className="p-6">
      <h1>My Jobs</h1>

      {jobs.map((job) => (
        <div key={job._id} className="border p-4 mb-3">
          <h2>{job.title}</h2>

          <button
            onClick={() => navigate(`/recruiter/applicants/${job._id}`)}
            className="bg-green-500 text-white px-3 py-1 mt-2"
          >
            View Applicants
          </button>
        </div>
      ))}
    </div>
  );
};

export default MyJobs;
