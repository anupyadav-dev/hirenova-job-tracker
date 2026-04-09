export const ApplicationCard = ({ app }) => {
  const statusStyles = {
    accepted: "bg-green-100 text-green-600",
    rejected: "bg-red-100 text-red-600",
    pending: "bg-yellow-100 text-yellow-600",
  };

  return (
    <div className="border p-4 rounded-lg shadow-sm hover:shadow-md transition">
      <h2 className="text-lg font-semibold">{app.job?.title}</h2>

      <p className="text-sm text-gray-500 mt-1">
        {app.job?.location || "Remote"}
      </p>

      <div className="mt-3 flex justify-between items-center">
        {/* Status Badge */}
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${
            statusStyles[app.status] || "bg-gray-100 text-gray-600"
          }`}
        >
          {app.status}
        </span>

        {/* Date */}
        <span className="text-xs text-gray-400">
          Applied on {new Date(app.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};
