import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <aside className="w-64 min-h-screen bg-gray-800 text-white p-5">
      <h2 className="font-bold mb-5">Dashboard</h2>

      {user?.role === "recruiter" && (
        <>
          <Link to="/dashboard" className="block mb-2">
            My Jobs
          </Link>
          <Link to="/post-job" className="block mb-2">
            Post Job
          </Link>
        </>
      )}

      {user?.role === "admin" && (
        <>
          <Link to="/admin/users" className="block mb-2">
            Users
          </Link>
          <Link to="/admin/recruiters" className="block mb-2">
            Recruiters
          </Link>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
