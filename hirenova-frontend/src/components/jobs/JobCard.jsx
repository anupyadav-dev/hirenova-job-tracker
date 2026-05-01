import { Link } from "react-router-dom";

const JobCard = ({ job }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
      <h3 className="text-lg font-semibold">{job.title}</h3>

      <p className="text-gray-600">{job.company}</p>

      <p className="text-sm text-gray-500 mt-1">📍 {job.location}</p>

      <div className="mt-2 text-blue-600 font-medium">
        ₹ {job.salary || "Not disclosed"}
      </div>

      <Link
        to={`/jobs/${job._id}`}
        className="inline-block mt-3 text-sm text-blue-600 hover:underline"
      >
        View Details →
      </Link>
    </div>
  );
};

export default JobCard;
