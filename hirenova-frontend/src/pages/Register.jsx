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
    <div className="flex justify-center items-center h-screen">
      <form className="p-6 shadow-lg w-80" onSubmit={handleSubmit}>
        <h2 className="text-xl mb-4">Register</h2>

        <input
          placeholder="Name"
          className="w-full mb-2 p-2 border"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          className="w-full mb-2 p-2 border"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-2 p-2 border"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <select
          className="w-full mb-3 p-2 border"
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="recruiter">Recruiter</option>
        </select>

        <button className="bg-green-500 text-white w-full p-2">Register</button>
      </form>
    </div>
  );
};

export default Register;
