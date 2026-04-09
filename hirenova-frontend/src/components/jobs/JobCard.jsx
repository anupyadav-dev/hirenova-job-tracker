import { useNavigate } from "react-router-dom";

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/jobs/${job._id}`);
  };

  return (
    <div
      onClick={handleNavigate}
      className="border p-4 rounded-lg shadow-sm cursor-pointer 
                 hover:shadow-md hover:scale-[1.01] transition-all duration-200"
    >
      {/* Title */}
      <h2 className="text-lg font-semibold line-clamp-1">{job.title}</h2>

      {/* Description */}
      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
        {job.description || "No description available"}
      </p>

      {/* Location */}
      <p className="text-xs text-gray-500 mt-2">
         {job.location || "Remote"}
      </p>

      {/* Footer */}
      <div className="mt-3 flex justify-between items-center">
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
          {job.type || "Full-Time"}
        </span>

        <span className="text-sm text-blue-600">View →</span>
      </div>
    </div>
  );
};

export default JobCard;
