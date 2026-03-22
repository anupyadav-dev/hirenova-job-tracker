import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const { token, user } = useSelector((state) => state.auth);

  // Not logged in
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Role-based check
  if (role && user?.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
