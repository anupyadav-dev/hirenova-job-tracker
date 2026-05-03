import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";
import { toast } from "react-toastify";
import { useState } from "react";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  // 🔥 Detect dashboard
  const isDashboard =
    location.pathname.startsWith("/recruiter") ||
    location.pathname.startsWith("/admin");

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/" ? "text-blue-400" : "";
    }
    return location.pathname.startsWith(path) ? "text-blue-400" : "";
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Logged out");
      navigate("/");
    } catch {
      toast.error("Logout failed");
    }
  };

  const navLinks = {
    user: [
      { path: "/my-applications", label: "Applications" },
      { path: "/profile", label: "Profile" },
    ],
    recruiter: [
      { path: "/recruiter/dashboard", label: "Dashboard" },
      { path: "/recruiter/create-job", label: "Create Job" },
    ],
    admin: [{ path: "/admin/dashboard", label: "Admin" }],
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 shadow">
      <div className="flex justify-between items-center">
        {/* LOGO */}
        <Link to="/" className="font-bold text-xl">
          Hirenova
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-5 items-center text-sm">
          {!isDashboard && (
            <>
              <Link to="/" className={isActive("/")}>
                Home
              </Link>
              <Link to="/jobs" className={isActive("/jobs")}>
                Jobs
              </Link>
            </>
          )}

          {isDashboard && (
            <Link to="/" className="text-gray-300 hover:text-white">
              ← Back Home
            </Link>
          )}

          {!user && !isDashboard && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}

          {user &&
            !isDashboard &&
            navLinks[user.role]?.map((link) => (
              <Link key={link.path} to={link.path}>
                {link.label}
              </Link>
            ))}

          {user && !isDashboard && (
            <>
              <span className="text-gray-300">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-3 text-sm">
          {!isDashboard && (
            <>
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
              <Link to="/jobs" onClick={() => setMenuOpen(false)}>
                Jobs
              </Link>
            </>
          )}

          {isDashboard && (
            <Link to="/" onClick={() => setMenuOpen(false)}>
              ← Back to Home
            </Link>
          )}

          {!user && !isDashboard && (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>
                Register
              </Link>
            </>
          )}

          {user &&
            !isDashboard &&
            navLinks[user.role]?.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

          {user && !isDashboard && (
            <>
              <span className="text-gray-300">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
