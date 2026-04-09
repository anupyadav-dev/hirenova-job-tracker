import { useState } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ApplyButton = ({ jobId, alreadyApplied = false }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [applied, setApplied] = useState(alreadyApplied);
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    // 🔹 Prevent multiple clicks
    if (loading || applied) return;

    // 🔹 Not logged in
    if (!user) {
      toast.info("Please login to apply");
      navigate("/login", { state: { from: `/jobs/${jobId}` } });
      return;
    }

    try {
      setLoading(true);

      await axios.post(`/applications/apply/${jobId}`);

      setApplied(true);
      toast.success("Application submitted successfully 🚀");
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to apply. Try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleApply}
      disabled={applied || loading}
      className={`w-full sm:w-auto px-5 py-2.5 mt-4 text-white rounded-lg font-medium
        transition-all duration-200 flex items-center justify-center gap-2
        ${
          applied
            ? "bg-gray-400 cursor-not-allowed"
            : loading
            ? "bg-green-400"
            : "bg-green-500 hover:bg-green-600 active:scale-95"
        }`}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      )}

      {loading ? "Applying..." : applied ? "Already Applied" : "Apply Now"}
    </button>
  );
};

export default ApplyButton;
