import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <nav className="bg-gray-900 text-white px-5 py-3 flex justify-between">
      <h1 className="font-bold">Hirenova</h1>

      <div className="flex gap-4">
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {user?.role === "user" && (
          <>
            <Link to="/">Home</Link>
            <Link to="/my-applications">My Applications</Link>
            <Link to="/profile">Profile</Link>
          </>
        )}

        {user?.role === "recruiter" && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/post-job">Post Job</Link>
          </>
        )}

        {user?.role === "admin" && (
          <>
            <Link to="/admin">Admin Panel</Link>
          </>
        )}

        {user && <button onClick={handleLogout}>Logout</button>}
      </div>
    </nav>
  );
};

export default Navbar;
