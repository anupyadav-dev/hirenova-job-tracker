import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "../components/common/Loader";

const ProtectedRoute = ({ children, role }) => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) return <Loader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
