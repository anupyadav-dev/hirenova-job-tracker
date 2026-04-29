import { useState } from "react";
import { useDispatch } from "react-redux";
import { uploadAvatar } from "../../features/profile/profileSlice";
import { toast } from "react-toastify";

function AvatarUpload() {
  const dispatch = useDispatch();

  const [error, setError] = useState("");

  const handleChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setError("");

    const result = await dispatch(uploadAvatar(file));

    if (uploadAvatar.fulfilled.match(result)) {
      toast.success("Avatar updated");
    } else {
      setError(result.payload || "Upload failed");
    }

    e.target.value = "";
  };

  return (
    <div className="mt-3">
      <label className="cursor-pointer inline-block bg-gray-100 px-4 py-2 rounded hover:bg-gray-200">
        Change Photo
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleChange}
          className="hidden"
        />
      </label>

      {error && (
        <p className="text-red-500 text-sm mt-2 max-w-[220px]">{error}</p>
      )}
    </div>
  );
}

export default AvatarUpload;
