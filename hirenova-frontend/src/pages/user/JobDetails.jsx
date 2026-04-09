import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";

import ApplyButton from "../../components/jobs/ApplyButton";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";

const JobDetails = () => {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/jobs/${id}`);

        if (isMounted) {
          setJob(res.data.job);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || "Something went wrong");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchJob();

    return () => {
      isMounted = false; // cleanup (important 🔥)
    };
  }, [id]);

  // 🔥 STATES
  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} />;
  if (!job) return <ErrorState message="Job not found" />;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-2">{job.title}</h1>

      {/* Location */}
      <p className="text-gray-500 mb-4">{job.location}</p>

      {/* Description */}
      <div className="bg-white shadow p-4 rounded mb-4">
        <h2 className="font-semibold mb-2">Job Description</h2>
        <p>{job.description}</p>
      </div>

      {/* Extra Info */}
      <div className="flex gap-4 text-sm text-gray-600 mb-4">
        {job.salary && <span>💰 {job.salary}</span>}
        {job.type && <span> {job.type}</span>}
      </div>

      {/* Apply Button */}
      <ApplyButton jobId={job._id} />
    </div>
  );
};

export default JobDetails;
