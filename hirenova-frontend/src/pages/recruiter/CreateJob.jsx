import { useState } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/common/Loader";

const CreateJob = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    salary: "",
    jobType: "full-time",
    skills: "",
    experienceMin: "",
    experienceMax: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.company || !form.location) {
      toast.error("Please fill required fields");
      return;
    }

    if (
      form.experienceMin &&
      form.experienceMax &&
      Number(form.experienceMin) > Number(form.experienceMax)
    ) {
      toast.error("Min experience cannot be greater than max");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: form.title,
        description: form.description,
        company: form.company,
        location: form.location,
        salary: Number(form.salary),
        jobType: form.jobType,
        skills: form.skills ? form.skills.split(",").map((s) => s.trim()) : [],
        experience: {
          min: Number(form.experienceMin) || 0,
          max: Number(form.experienceMax) || 1,
        },
      };

      await axios.post("/jobs", payload);

      toast.success("Job Created Successfully!");
      navigate("/recruiter/jobs");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Job</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="title"
              placeholder="Job Title"
              value={form.title}
              onChange={handleChange}
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="text"
              name="company"
              placeholder="Company Name"
              value={form.company}
              onChange={handleChange}
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="number"
              name="salary"
              placeholder="Salary (Annual)"
              value={form.salary}
              onChange={handleChange}
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* ✅ EXPERIENCE FIELDS */}
            <input
              type="number"
              name="experienceMin"
              placeholder="Min Experience (years)"
              value={form.experienceMin}
              onChange={handleChange}
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="number"
              name="experienceMax"
              placeholder="Max Experience (years)"
              value={form.experienceMax}
              onChange={handleChange}
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <select
              name="jobType"
              value={form.jobType}
              onChange={handleChange}
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="internship">Internship</option>
              <option value="contract">Contract</option>
            </select>

            <input
              type="text"
              name="skills"
              placeholder="Skills (comma separated)"
              value={form.skills}
              onChange={handleChange}
              className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* DESCRIPTION */}
          <textarea
            name="description"
            placeholder="Job Description"
            value={form.description}
            onChange={handleChange}
            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={5}
          />

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition font-medium"
          >
            Create Job
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;
