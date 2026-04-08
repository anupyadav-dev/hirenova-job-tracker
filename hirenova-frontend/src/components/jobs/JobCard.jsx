import { useNavigate } from "react-router-dom";

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div
      className="border p-4 shadow cursor-pointer hover:shadow-lg transition"
      onClick={() => navigate(`/jobs/${job._id}`)}
    >
      <h2 className="text-lg font-semibold">{job.title}</h2>
      <p>{job.description}</p>
      <p className="text-sm text-gray-500">{job.location}</p>
    </div>
  );
};

export default JobCard;
