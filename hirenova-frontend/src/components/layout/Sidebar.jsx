import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { logoutUser } from "../../features/auth/authSlice";

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isActive = (path) =>
    location.pathname.startsWith(path) ? "bg-gray-700" : "";

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Logged out successfully");
      navigate("/");
    } catch {
      toast.error("Logout failed");
    }
  };

  const sidebarLinks = {
    recruiter: [
      { path: "/recruiter/dashboard", label: "Dashboard" },
      { path: "/recruiter/create-job", label: "Create Job" },
      { path: "/recruiter/jobs", label: "My Jobs" },
    ],
    admin: [
      { path: "/admin/dashboard", label: "Dashboard" },
      { path: "/admin/users", label: "Users" },
      { path: "/admin/jobs", label: "Jobs" },
      { path: "/admin/recruiters", label: "Recruiters" },
    ],
  };

  return (
    <aside className="w-64 min-h-screen bg-gray-800 text-white p-5 flex flex-col justify-between">
      <div>
        <h2 className="font-bold text-xl mb-6">Dashboard</h2>

        {user &&
          sidebarLinks[user.role]?.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block mb-2 p-2 rounded hover:bg-gray-700 ${isActive(
                link.path,
              )}`}
            >
              {link.label}
            </Link>
          ))}
      </div>

      {/* ✅ ONLY logout here */}
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 p-2 rounded"
      >
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
