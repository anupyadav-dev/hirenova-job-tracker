import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateMyProfile } from "../../features/profile/profileSlice";
import { toast } from "react-toastify";

function EditProfileModal({ profile, onClose }) {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    bio: profile?.bio || "",
    phone: profile?.phone || "",
    experience: profile?.experience || "",
    skills: profile?.skills?.join(", ") || "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(updateMyProfile(form));

    if (updateMyProfile.fulfilled.match(result)) {
      toast.success("Profile updated");
      onClose();
    } else {
      toast.error(result.payload);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-5">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Your bio"
            className="w-full border rounded p-2"
          />

          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full border rounded p-2"
          />

          <input
            type="text"
            name="experience"
            value={form.experience}
            onChange={handleChange}
            placeholder="Experience"
            className="w-full border rounded p-2"
          />

          <input
            type="text"
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="React, Node, MongoDB"
            className="w-full border rounded p-2"
          />

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded"
            >
              Save
            </button>

            <button
              type="button"
              onClick={onClose}
              className="border px-5 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;
