import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRecommendedJobs } from "../features/jobs/jobSlice";

const RecommendedJobs = () => {
  const dispatch = useDispatch();
  const { recommendedJobs, loading } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(getRecommendedJobs());
  }, []);

  if (loading) return <p>Loading recommendations...</p>;

  if (!recommendedJobs?.length) {
    return <p>No recommendations available</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">🔥 Recommended For You</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendedJobs.map((job) => (
          <div key={job._id} className="border p-4 rounded">
            <h3 className="font-semibold">{job.title}</h3>
            <p>{job.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedJobs;
