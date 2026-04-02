import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <nav className="flex justify-between p-4 bg-gray-800 text-white">
      <Link to="/">Hirenova</Link>

      <div className="flex gap-4">
        {user?.role === "user" && (
          <>
            <Link to="/">Jobs</Link>
            <Link to="/my-applications">My Applications</Link>
          </>
        )}

        {user?.role === "recruiter" && (
          <>
            <Link to="/recruiter/dashboard">Dashboard</Link>
          </>
        )}

        {user?.role === "admin" && (
          <>
            <Link to="/admin/dashboard">Admin</Link>
          </>
        )}

        <button onClick={() => dispatch(logout())}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
