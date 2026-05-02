const JobCard = ({ job, onClick, actions }) => {
  return (
    <div
      className="border rounded-xl p-5 shadow-sm hover:shadow-lg transition bg-white"
      onClick={onClick}
    >
      {/* HEADER */}
      <div className="flex justify-between">
        <h2 className="text-lg font-semibold">{job.title}</h2>

        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">
          {job.status}
        </span>
      </div>

      {/* INFO */}
      <p className="text-sm text-gray-500">
        {job.company} • {job.location}
      </p>

      <p className="text-sm mt-2 line-clamp-2">{job.description}</p>

      {/* FOOTER */}
      <div className="mt-4 flex justify-between items-center">
        <p className="font-medium">₹{job.salary?.toLocaleString()}</p>

        {/* 🔥 Actions injected */}
        <div onClick={(e) => e.stopPropagation()}>{actions}</div>
      </div>
    </div>
  );
};

export default JobCard;
