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
    if (applied) return;

    try {
      if (!user) {
        toast.info("Please login to apply");
        navigate("/login", { state: { from: `/jobs/${jobId}` } });
        return;
      }

      setLoading(true);

      await axios.post(`/applications/apply/${jobId}`);

      setApplied(true);
      toast.success("Applied successfully ");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleApply}
      disabled={applied || loading}
      className={`px-4 py-2 mt-4 text-white rounded transition ${
        applied
          ? "bg-gray-400 cursor-not-allowed"
          : loading
          ? "bg-green-300"
          : "bg-green-500 hover:bg-green-600"
      }`}
    >
      {loading ? "Applying..." : applied ? "Already Applied" : "Apply Now"}
    </button>
  );
};

export default ApplyButton;
