import { useState } from "react";
import { useDispatch } from "react-redux";
import { createMyProfile } from "../../features/profile/profileSlice";
import { toast } from "react-toastify";

function CreateProfileForm() {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    bio: "",
    phone: "",
    experience: "",
    skills: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(createMyProfile(form));

    if (createMyProfile.fulfilled.match(result)) {
      toast.success("Profile created");
    } else {
      toast.error(result.payload);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-xl shadow"
    >
      <h2 className="text-xl font-bold">Create Profile</h2>

      <textarea
        name="bio"
        placeholder="Bio"
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <input
        name="phone"
        placeholder="Phone"
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <input
        name="experience"
        placeholder="Experience"
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <input
        name="skills"
        placeholder="React, Node"
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Create Profile
      </button>
    </form>
  );
}

export default CreateProfileForm;
