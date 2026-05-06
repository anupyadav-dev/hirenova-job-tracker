import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLatestJobs } from "../../features/jobs/jobSlice";
import { useNavigate, Link } from "react-router-dom";

import RecommendedJobs from "../../components/jobs/RecommendedJobs";
import JobList from "../../components/jobs/JobList";
import JobActions from "../../components/jobs/JobActions";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { latestJobs, loading, error } = useSelector((state) => state.jobs);

  const role = user?.role || "guest";

  useEffect(() => {
    if (!latestJobs || latestJobs.length === 0) {
      dispatch(getLatestJobs());
    }
  }, [dispatch, latestJobs.length]);

  return (
    <div className="p-6 space-y-10">
      {/* Recommended */}
      {role === "user" && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Recommended for you</h2>
          <RecommendedJobs />
        </section>
      )}

      {/* Latest Jobs */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Latest Jobs</h2>

          <Link to="/jobs" className="text-blue-500">
            View All →
          </Link>
        </div>

        {error.latest ? (
          <ErrorState message="Failed to load latest jobs" />
        ) : loading.latest ? (
          <Loader />
        ) : latestJobs.length === 0 ? (
          <EmptyState message="No latest jobs available" />
        ) : (
          <JobList
            jobs={latestJobs}
            role={role}
            onJobClick={(job) => navigate(`/jobs/${job._id}`)}
            renderActions={(job, role) => <JobActions role={role} job={job} />}
          />
        )}
      </section>
    </div>
  );
};

export default Home;
