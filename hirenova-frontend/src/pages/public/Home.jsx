import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getJobs } from "../../features/jobs/jobSlice";
import { useNavigate } from "react-router-dom";

import RecommendedJobs from "../../components/jobs/RecommendedJobs";
import JobList from "../../components/jobs/JobList";
import { Link } from "react-router-dom";
import ApplyButton from "../../components/jobs/ApplyButton";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { jobs } = useSelector((state) => state.jobs);

  useEffect(() => {
    // 👇 latest 6 jobs fetch
    dispatch(getJobs({ page: 1, limit: 6 }));
  }, [dispatch]);

  return (
    <div className="p-6 space-y-10">
      {/* Recommended Jobs */}
      {user && (
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

        {/* ✅ FIX: pass jobs */}
        <JobList
          jobs={jobs}
          onJobClick={(job) => navigate(`/jobs/${job._id}`)}
          renderActions={(job) => <ApplyButton jobId={job._id} />}
        />
      </section>
    </div>
  );
};

export default Home;
