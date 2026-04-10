import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  const isActive = (path) => (location.pathname === path ? "bg-gray-700" : "");

  return (
    <aside className="w-64 min-h-screen bg-gray-800 text-white p-5">
      <h2 className="font-bold text-xl mb-6">Dashboard</h2>

      {/* RECRUITER */}
      {user?.role === "recruiter" && (
        <>
          <Link
            to="/recruiter/dashboard"
            className={`block mb-2 p-2 rounded ${isActive(
              "/recruiter/dashboard"
            )}`}
          >
            Dashboard
          </Link>

          <Link
            to="/recruiter/create-job"
            className={`block mb-2 p-2 rounded ${isActive(
              "/recruiter/create-job"
            )}`}
          >
            Create Job
          </Link>

          <Link
            to="/recruiter/jobs"
            className={`block mb-2 p-2 rounded ${isActive("/recruiter/jobs")}`}
          >
            My Jobs
          </Link>
        </>
      )}

      {/* ADMIN */}
      {user?.role === "admin" && (
        <>
          <Link
            to="/admin/dashboard"
            className={`block mb-2 p-2 rounded ${isActive("/admin/dashboard")}`}
          >
            Dashboard
          </Link>

          <Link
            to="/admin/users"
            className={`block mb-2 p-2 rounded ${isActive("/admin/users")}`}
          >
            Users
          </Link>

          <Link
            to="/admin/jobs"
            className={`block mb-2 p-2 rounded ${isActive("/admin/jobs")}`}
          >
            Jobs
          </Link>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
