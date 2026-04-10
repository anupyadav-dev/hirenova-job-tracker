const ApplicantCard = ({ app, onAccept, onReject }) => {
  const statusStyles = {
    accepted: "bg-green-100 text-green-600",
    rejected: "bg-red-100 text-red-600",
    pending: "bg-yellow-100 text-yellow-600",
  };

  return (
    <div className="border p-4 rounded-lg shadow-sm hover:shadow-md transition">
      {/* Name */}
      <h2 className="text-lg font-semibold">
        {app.applicant?.name || "Unknown"}
      </h2>

      {/* Email */}
      <p className="text-sm text-gray-500">
        {app.applicant?.email || "No email"}
      </p>

      {/* Status */}
      <div className="mt-3">
        <span
          className={`px-3 py-1 text-xs rounded-full capitalize ${
            statusStyles[app.status] || "bg-gray-100 text-gray-600"
          }`}
        >
          {app.status}
        </span>
      </div>

      {/* Actions */}
      {app.status === "pending" && (
        <div className="mt-4 flex gap-3">
          <button
            onClick={onAccept}
            className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
          >
            Accept
          </button>

          <button
            onClick={onReject}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default ApplicantCard;
