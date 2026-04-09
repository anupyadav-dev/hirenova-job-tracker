import { useSelector } from "react-redux";
import RecommendedJobs from "../../components/jobs/RecommendedJobs";
import JobList from "../../components/jobs/JobList";
import { Link } from "react-router-dom";

const Home = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="p-6 space-y-10">
      {/* Recommended Jobs */}
      {user && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Recommended for you</h2>
          <RecommendedJobs />
        </section>
      )}

      {/* Latest Jobs Preview */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Latest Jobs</h2>

          {/* 👇 Important */}
          <Link to="/jobs" className="text-blue-500">
            View All →
          </Link>
        </div>

        {/* 👇 only preview */}
        <JobList limit={6} />
      </section>
    </div>
  );
};

export default Home;
