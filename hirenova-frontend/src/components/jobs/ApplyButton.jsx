import { useDispatch, useSelector } from "react-redux";
import {
  applyJob,
  getMyApplications,
} from "../../features/applications/applicationSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const ApplyButton = ({ jobId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { applications = [], applying } = useSelector(
    (state) => state.applications,
  );

  console.log("applications", applications);
  console.log("jobId", jobId);

  const [localLoading, setLocalLoading] = useState(false);

  const applied = applications.some((app) => {
    const appJobId =
      app.job?._id?.toString() || app.job?.toString() || app.jobId?.toString();

    return appJobId === jobId.toString();
  });

  const isGuest = !user;
  const isLoading = applying || localLoading;
  const isDisabled = applied || isLoading;
  const isDisabledFinal = isGuest ? false : isDisabled;

  const handleApply = async () => {
    if (isGuest) {
      toast.info("Please login to apply");
      return navigate("/login", {
        state: { from: `/jobs/${jobId}` },
      });
    }

    if (isDisabled) return;

    try {
      setLocalLoading(true);

      await dispatch(applyJob(jobId)).unwrap();

      toast.success("Applied successfully 🚀");

      // background sync
      dispatch(getMyApplications());
    } catch (err) {
      toast.error(err || "Failed to apply");
    } finally {
      setLocalLoading(false);
    }
  };

  const buttonText = isGuest
    ? "Login to Apply"
    : isLoading
      ? "Applying..."
      : applied
        ? "Already Applied"
        : "Apply Now";

  return (
    <button
      onClick={handleApply}
      disabled={isDisabledFinal}
      className={`px-5 py-2 rounded font-medium text-white transition-all duration-200
        ${
          applied
            ? "bg-gray-400 cursor-not-allowed"
            : isLoading
              ? "bg-green-400"
              : isGuest
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-green-500 hover:bg-green-600 active:scale-95"
        }`}
    >
      {buttonText}
    </button>
  );
};

export default ApplyButton;
