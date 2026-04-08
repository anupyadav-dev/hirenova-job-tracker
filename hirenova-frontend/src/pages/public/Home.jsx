import { useSelector } from "react-redux";
import RecommendedJobs from "../../components/jobs/RecommendedJobs";
import Jobs from "../user/Jobs";

const Home = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div>
      {user && <h2>Recommended for you</h2>}
      {user && <RecommendedJobs />}
      <h2>All Jobs</h2>
      <Jobs />
    </div>
  );
};

export default Home;
