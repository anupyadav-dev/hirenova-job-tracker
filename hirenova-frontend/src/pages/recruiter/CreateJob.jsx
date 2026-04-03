import { useState } from "react";
import axios from "../../api/axios";

const CreateJob = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/jobs", form);
      alert("Job Created!");
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="p-6">
      <h2>Create Job</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          placeholder="Title"
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          placeholder="Location"
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />

        <textarea
          placeholder="Description"
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <button className="bg-blue-500 text-white px-4 py-2">Create</button>
      </form>
    </div>
  );
};

export default CreateJob;
