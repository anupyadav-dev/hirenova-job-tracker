import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/auth/authSlice";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";

import Card from "../../components/ui/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || "/";

  const { loading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return toast.error("All fields are required");
    }

    try {
      const res = await dispatch(loginUser(form)).unwrap();

      toast.success("Login successful");

      const role = res.role;

      if (role === "recruiter") {
        navigate("/recruiter/dashboard");
      } else if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate(redirectPath);
      }
    } catch (err) {
      toast.error(err || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card>
        <h2 className="text-2xl font-bold text-center mb-6">
          Login to Hirenova
        </h2>

        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <Button loading={loading}>Login</Button>

          <p className="text-sm mt-4 text-center">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 font-medium">
              Register
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}

export default Login;
