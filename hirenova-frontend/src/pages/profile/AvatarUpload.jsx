import { useDispatch } from "react-redux";
import { uploadAvatar } from "../../features/profile/profileSlice";
import { toast } from "react-toastify";

function AvatarUpload() {
  const dispatch = useDispatch();

  const handleChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const result = await dispatch(uploadAvatar(file));

    if (uploadAvatar.fulfilled.match(result)) {
      toast.success("Avatar updated");
    } else {
      toast.error(result.payload);
    }
  };

  return (
    <label className="cursor-pointer inline-block mt-3 bg-gray-100 px-4 py-2 rounded hover:bg-gray-200">
      Change Photo
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleChange}
        className="hidden"
      />
    </label>
  );
}

export default AvatarUpload;
