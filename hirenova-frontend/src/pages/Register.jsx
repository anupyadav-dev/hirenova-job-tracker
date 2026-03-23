import { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../features/auth/authSlice";

const Register = () => {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(form));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        className="p-12 shadow-xl rounded-2xl w-[420px] min-h-[520px] bg-white flex flex-col justify-center space-y-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-semibold text-center mb-2">
          Create Account
        </h2>

        <input
          placeholder="Name"
          name={form.name}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          name={form.email}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          name={form.password}
          placeholder="Password"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <select
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="recruiter">Recruiter</option>
        </select>

        <button className="bg-green-500 hover:bg-green-600 transition text-white w-full p-3 rounded-lg text-lg">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
