import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getApplicants,
  updateApplicationStatus,
} from "../../features/applications/applicationSlice";
import { toast } from "react-toastify";
import ApplicantCard from "../../components/applications/ApplicantCard";

// ✅ Reusable components
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";

const Applicants = () => {
  const { jobId } = useParams();
  const dispatch = useDispatch();

  const { applicants, loading, error } = useSelector(
    (state) => state.applications
  );

  useEffect(() => {
    dispatch(getApplicants(jobId));
  }, [dispatch, jobId]);

  // 🔥 Update status handler
  const handleStatus = (id, status) => {
    dispatch(updateApplicationStatus({ id, status }));
    toast.success(`Application ${status}`);
  };

  // 🔹 Loading
  if (loading) return <Loader />;

  // 🔹 Error
  if (error) return <ErrorState message="Failed to load applicants" />;

  // 🔹 Empty
  if (!applicants || applicants.length === 0) {
    return <EmptyState message="No applicants yet" />;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Applicants</h1>

      <div className="grid gap-4">
        {applicants.map((app) => (
          <ApplicantCard
            key={app._id}
            app={app}
            onAccept={() => handleStatus(app._id, "accepted")}
            onReject={() => handleStatus(app._id, "rejected")}
          />
        ))}
      </div>
    </div>
  );
};

export default Applicants;
