import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getJobs } from "../../features/jobs/jobSlice";
import { useNavigate } from "react-router-dom";

import RecommendedJobs from "../../components/jobs/RecommendedJobs";
import JobList from "../../components/jobs/JobList";
import { Link } from "react-router-dom";
import JobActions from "../../components/jobs/JobActions";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { jobs } = useSelector((state) => state.jobs);
  const role = user?.role || "guest";

  useEffect(() => {
    dispatch(getJobs({ page: 1, limit: 6 }));
  }, [dispatch]);

  return (
    <div className="p-6 space-y-10">
      {role === "user" && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Recommended for you</h2>
          <RecommendedJobs />
        </section>
      )}

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Latest Jobs</h2>

          <Link to="/jobs" className="text-blue-500">
            View All →
          </Link>
        </div>

        <JobList
          jobs={jobs}
          role={user?.role}
          onJobClick={(job) => navigate(`/jobs/${job._id}`)}
          renderActions={(job, role) => <JobActions role={role} job={job} />}
        />
      </section>
    </div>
  );
};

export default Home;
