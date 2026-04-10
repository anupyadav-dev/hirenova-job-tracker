import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getRecruiterDashboard } from "../../features/recruiter/recruiterSlice";
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";

const RecruiterDashboard = () => {
  const dispatch = useDispatch();
  const { totalJobs, totalApplications, applicationsPerJob, loading, error } =
    useSelector((state) => state.recruiter);
  useEffect(() => {
    dispatch(getRecruiterDashboard());
  }, [dispatch]);

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} />;

  const cards = [
    {
      title: "Create Job",
      link: "/recruiter/create-job",
      bgColor: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "My Jobs",
      link: "/recruiter/jobs",
      bgColor: "bg-green-500 hover:bg-green-600",
    },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">Recruiter Dashboard</h1>

      {/* Dashboard Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="bg-white rounded shadow p-4">
          <p className="text-gray-500">Total Jobs</p>
          <p className="text-xl font-semibold">{totalJobs || 0}</p>
        </div>

        <div className="bg-white rounded shadow p-4">
          <p className="text-gray-500">Total Applications</p>
          <p className="text-xl font-semibold">{totalApplications || 0}</p>
        </div>

        <div className="bg-white rounded shadow p-4">
          <p className="text-gray-500">Applications per Job</p>
          <ul className="text-sm mt-2">
            {applicationsPerJob && applicationsPerJob.length > 0 ? (
              applicationsPerJob.map((job, idx) => (
                <li key={idx}>
                  {job.jobTitle} → {job.applications}
                </li>
              ))
            ) : (
              <li>No applications yet</li>
            )}
          </ul>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className={`${card.bgColor} text-white p-6 rounded-lg shadow-md text-center font-semibold transition transform hover:-translate-y-1`}
          >
            {card.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
