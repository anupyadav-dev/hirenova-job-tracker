import { Link } from "react-router-dom";

const RecruiterDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Recruiter Dashboard</h1>

      <div className="grid grid-cols-2 gap-4">
        <Link
          to="/recruiter/create-job"
          className="bg-blue-500 text-white p-4 text-center"
        >
          Create Job
        </Link>

        <Link
          to="/recruiter/jobs"
          className="bg-green-500 text-white p-4 text-center"
        >
          My Jobs
        </Link>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
