import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";
import { toast } from "react-toastify";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? "text-blue-400" : "";

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center shadow">
      <Link to="/" className="font-bold text-xl">
        Hirenova
      </Link>

      <div className="flex gap-5 items-center text-sm">
        <Link to="/" className={isActive("/")}>
          Home
        </Link>

        <Link to="/jobs" className={isActive("/jobs")}>
          Jobs
        </Link>

        {!user && (
          <>
            <Link to="/login" className={isActive("/login")}>
              Login
            </Link>
            <Link to="/register" className={isActive("/register")}>
              Register
            </Link>
          </>
        )}

        {user?.role === "user" && (
          <>
            <Link
              to="/my-applications"
              className={isActive("/my-applications")}
            >
              Applications
            </Link>

            <Link to="/profile" className={isActive("/profile")}>
              Profile
            </Link>
          </>
        )}

        {user?.role === "recruiter" && (
          <>
            <Link
              to="/recruiter/dashboard"
              className={isActive("/recruiter/dashboard")}
            >
              Dashboard
            </Link>

            <Link
              to="/recruiter/create-job"
              className={isActive("/recruiter/create-job")}
            >
              Create Job
            </Link>
          </>
        )}

        {user?.role === "admin" && (
          <Link to="/admin/dashboard" className={isActive("/admin/dashboard")}>
            Admin
          </Link>
        )}

        {user && (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
