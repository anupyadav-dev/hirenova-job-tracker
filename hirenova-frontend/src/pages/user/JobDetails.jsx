import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";
import ApplyButton from "../../components/ApplyButton";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      const res = await axios.get(`/jobs/${id}`);
      setJob(res.data.job);
    };

    fetchJob();
  }, [id]);

  if (!job) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{job.title}</h1>
      <p>{job.description}</p>
      <p className="text-gray-500">{job.location}</p>

      <ApplyButton jobId={job._id} />
    </div>
  );
};

export default JobDetails;
