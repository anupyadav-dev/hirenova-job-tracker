import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { logout } from "../../features/auth/authSlice";

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isActive = (path) => (location.pathname === path ? "bg-gray-700" : "");

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");

    setTimeout(() => {
      navigate("/", { replace: true });
    }, 0);
  };

  return (
    <aside className="w-64 min-h-screen bg-gray-800 text-white p-5 flex flex-col justify-between">
      {/* TOP SECTION */}
      <div>
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
              className={`block mb-2 p-2 rounded ${isActive(
                "/recruiter/jobs"
              )}`}
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
              className={`block mb-2 p-2 rounded ${isActive(
                "/admin/dashboard"
              )}`}
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
            <Link
              to="/admin/recruiters"
              className={`block mb-2 p-2 rounded ${isActive(
                "/admin/recruiters"
              )}`}
            >
              Recruiters
            </Link>
          </>
        )}
      </div>

      {/* 🔥 LOGOUT BUTTON */}
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 p-2 rounded mt-6"
      >
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
