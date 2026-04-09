import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../features/auth/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return toast.error("All fields are required");
    }

    try {
      setLoading(true);

      const res = await dispatch(loginUser(form)).unwrap();

      toast.success("Login successful ");

      if (res.user.role === "recruiter") {
        navigate("/recruiter/dashboard");
      } else if (res.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate(from);
      }
    } catch (err) {
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="p-12 shadow-xl rounded-2xl w-[400px] min-h-[450px] bg-white flex flex-col justify-center space-y-5"
      >
        <h2 className="text-2xl font-semibold text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          className="w-full p-3 border rounded-lg"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          va={form.password}
          className="w-full p-3 border rounded-lg"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          disabled={loading}
          className={`w-full p-3 rounded-lg text-white ${
            loading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
