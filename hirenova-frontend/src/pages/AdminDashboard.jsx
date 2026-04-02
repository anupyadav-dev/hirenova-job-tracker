import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-2 gap-4">
        <Link
          to="/admin/users"
          className="bg-blue-500 text-white p-4 text-center"
        >
          Manage Users
        </Link>

        <Link
          to="/admin/jobs"
          className="bg-red-500 text-white p-4 text-center"
        >
          Manage Jobs
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;