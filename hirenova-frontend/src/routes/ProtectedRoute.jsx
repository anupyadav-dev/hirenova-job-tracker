import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Loader from "../components/common/Loader";

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, initialized, user } = useSelector(
    (state) => state.auth,
  );

  const location = useLocation();

  if (!initialized) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (role && user?.role !== role) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (user?.role === "recruiter") {
      return <Navigate to="/recruiter/dashboard" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
