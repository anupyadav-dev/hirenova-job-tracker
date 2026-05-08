import { MapPin, Briefcase, IndianRupee } from "lucide-react";

const JobCard = ({ job, onClick, actions }) => {
  return (
    <div
      onClick={onClick}
      className="group relative bg-white border border-gray-200 rounded-2xl p-5 shadow-sm 
      hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {/* TOP SECTION */}
      <div className="flex justify-between items-start gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">
            {job.title}
          </h2>

          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
            <Briefcase size={14} /> {job.company}
          </p>
        </div>

        {/* STATUS BADGE */}
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium
          ${
            job.status === "active"
              ? "bg-green-100 text-green-600"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {job.status}
        </span>
      </div>

      {/* LOCATION */}
      <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
        <MapPin size={14} /> {job.location}
      </p>

      {/* DESCRIPTION */}
      <p className="text-sm text-gray-600 mt-3 line-clamp-2">
        {job.description}
      </p>

      {/* TAGS */}
      <div className="flex flex-wrap gap-2 mt-3">
        {job.jobType && (
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
            {job.jobType}
          </span>
        )}

        {job.category && (
          <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
            {job.category}
          </span>
        )}
      </div>

      {/* FOOTER */}
      <div className="mt-5 flex justify-between items-center">
        {/* SALARY */}
        <div className="flex items-center gap-1 text-green-600 font-semibold">
          <IndianRupee size={16} />
          <span>
            {job.salary ? job.salary.toLocaleString() : "Not disclosed"}
          </span>
        </div>

        {/* ACTIONS */}
        <div onClick={(e) => e.stopPropagation()}>{actions}</div>
      </div>

      {/* HOVER BORDER EFFECT */}
      <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-blue-200 transition pointer-events-none"></div>
    </div>
  );
};

export default JobCard;
