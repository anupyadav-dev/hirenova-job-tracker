import ApplyButton from "../jobs/ApplyButton";

const JobActions = ({ role, job, onDelete, navigate }) => {
  const isRecruiter = role === "recruiter";

  if (isRecruiter) {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => navigate(`/recruiter/applicants/${job._id}`)}
          className="px-3 py-1 text-sm bg-green-500 text-white rounded"
        >
          Applicants
        </button>

        <button
          onClick={() => navigate(`/recruiter/edit-job/${job._id}`)}
          className="px-3 py-1 text-sm bg-yellow-500 text-white rounded"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(job._id)}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded"
        >
          Delete
        </button>
      </div>
    );
  }

  return <ApplyButton jobId={job._id} />;
};

export default JobActions;
