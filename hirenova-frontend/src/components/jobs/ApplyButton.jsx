import { useDispatch, useSelector } from "react-redux";
import { applyJob } from "../../features/applications/applicationSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const ApplyButton = ({ jobId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  // 🔥 safer selector (from applicationSlice)
  const { applications = [], applying } = useSelector(
    (state) => state.applications,
  );

  const [localLoading, setLocalLoading] = useState(false);

  const applied = applications.some(
    (app) => app.job === jobId || app.jobId === jobId,
  );

  const handleApply = async () => {
    if (!user) {
      toast.info("Please login to apply");
      return navigate("/login", { state: { from: `/jobs/${jobId}` } });
    }

    if (applied || applying || localLoading) return;

    try {
      setLocalLoading(true);

      await dispatch(applyJob(jobId)).unwrap();

      toast.success("Applied successfully 🚀");
    } catch (err) {
      toast.error(err || "Failed to apply");
    } finally {
      setLocalLoading(false);
    }
  };

  const isDisabled = applied || applying || localLoading;

  return (
    <button
      onClick={handleApply}
      disabled={isDisabled}
      className={`px-5 py-2 rounded font-medium text-white transition-all duration-200
        ${
          applied
            ? "bg-gray-400 cursor-not-allowed"
            : isDisabled
              ? "bg-green-400"
              : "bg-green-500 hover:bg-green-600 active:scale-95"
        }`}
    >
      {localLoading || applying
        ? "Applying..."
        : applied
          ? "Already Applied"
          : "Apply Now"}
    </button>
  );
};

export default ApplyButton;
