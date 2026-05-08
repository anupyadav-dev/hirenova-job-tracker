import { useDispatch, useSelector } from "react-redux";
import { applyJob } from "../../features/applications/applicationSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ApplyButton = ({ jobId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { appliedJobIds = [], loading } = useSelector(
    (state) => state.applications,
  );

  const isGuest = !user;
  const isLoading = loading.action;

  const applied = appliedJobIds.includes(jobId);

  const isDisabled = isGuest ? false : applied || isLoading;

  const handleApply = async () => {
    if (isGuest) {
      toast.info("Please login to apply");
      return navigate("/login", {
        state: { from: `/jobs/${jobId}` },
      });
    }

    if (isDisabled) return;

    try {
      await dispatch(applyJob({ jobId })).unwrap();
      toast.success("Applied successfully 🚀");
    } catch (err) {
      toast.error(err || "Failed to apply");
    }
  };

  const buttonText = isGuest
    ? "Login to Apply"
    : isLoading
      ? "Applying..."
      : applied
        ? "Applied"
        : "Apply Now";

  return (
    <button
      onClick={handleApply}
      disabled={isDisabled}
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
