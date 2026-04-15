import AppRoutes from "./routes/AppRoutes";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUser, logout } from "./features/auth/authSlice";
import { useNavigate } from "react-router-dom";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

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
