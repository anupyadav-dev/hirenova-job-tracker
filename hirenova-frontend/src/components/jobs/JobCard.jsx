import { useNavigate } from "react-router-dom";
import ApplyButton from "../jobs/ApplyButton";

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div className="border rounded-xl p-5 shadow-sm hover:shadow-lg transition bg-white flex flex-col justify-between">
      {/* TOP */}
      <div
        onClick={() => navigate(`/jobs/${job._id}`)}
        className="cursor-pointer"
      >
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-semibold">{job.title}</h2>

          <span
            className={`text-xs px-2 py-1 rounded-full ${
              job.status === "active"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {job.status}
          </span>
        </div>

        <p className="text-sm text-gray-500 mt-1">
          {job.company} • {job.location}
        </p>

        <p className="text-sm mt-2 text-gray-700 line-clamp-2">
          {job.description}
        </p>

        <div className="flex gap-2 mt-3 flex-wrap">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
            {job.jobType}
          </span>

          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
            {job.experience?.min}-{job.experience?.max} yrs
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {job.skills?.slice(0, 4).map((skill, i) => (
            <span
              key={i}
              className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <p className="font-medium text-gray-800">
          ₹{job.salary?.toLocaleString()}
        </p>

        <ApplyButton jobId={job._id} />
      </div>
    </div>
  );
};

export default JobCard;
