import AppRoutes from "./routes/AppRoutes";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser, logout } from "./features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { getMyApplications } from "../src/features/applications/applicationSlice";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { applications } = useSelector((state) => state.applications);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    if (user?.role === "user" && applications.length === 0) {
      dispatch(getMyApplications());
    }
  }, [user, applications.length, dispatch]);

  useEffect(() => {
    const handleLogout = () => {
      dispatch(logout());
      window.__isLoggingOut = false;

      navigate("/login", { replace: true });
    };

    window.addEventListener("logout", handleLogout);

    return () => window.removeEventListener("logout", handleLogout);
  }, [dispatch, navigate]);

  return <AppRoutes />;
}

export default App;
