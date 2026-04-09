import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRecommendedJobs } from "../../features/jobs/jobSlice";

import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import JobCard from "../../components/jobs/JobCard";

const RecommendedJobs = () => {
  const dispatch = useDispatch();

  const { recommendedJobs, loading, error } = useSelector(
    (state) => state.jobs
  );

  useEffect(() => {
    dispatch(getRecommendedJobs());
  }, [dispatch]);

  if (loading) return <Loader />;

  if (error) return <ErrorState message="Failed to load recommendations" />;

  if (!recommendedJobs || recommendedJobs.length === 0) {
    return <EmptyState message="No recommendations available" />;
  }

  return (
    <div className="mb-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendedJobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedJobs;
