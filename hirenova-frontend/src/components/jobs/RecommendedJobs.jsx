import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getRecommendedJobs } from "../../features/jobs/jobSlice";

import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";

import JobList from "../../components/jobs/JobList";
import JobActions from "../../components/jobs/JobActions";

const RecommendedJobs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const role = user?.role || "guest";

  const { recommendedJobs, loading, error } = useSelector(
    (state) => state.jobs,
  );

  useEffect(() => {
    dispatch(getRecommendedJobs());
  }, [dispatch]);


  if (loading) return <Loader />;

  if (error) {
    return <ErrorState message="Failed to load recommendations" />;
  }

  if (!recommendedJobs || recommendedJobs.length === 0) {
    return <EmptyState message="No recommendations available" />;
  }

  return (
    <div className="mb-6">
      <JobList
        jobs={recommendedJobs}
        role={role}
        onJobClick={(job) => navigate(`/jobs/${job._id}`)}
        renderActions={(job) => (
          <JobActions role={role} job={job} navigate={navigate} />
        )}
      />
    </div>
  );
};

export default RecommendedJobs;
