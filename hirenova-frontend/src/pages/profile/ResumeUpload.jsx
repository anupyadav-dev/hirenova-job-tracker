import { useDispatch } from "react-redux";
import { uploadResume } from "../../features/profile/profileSlice";
import { toast } from "react-toastify";

function ResumeUpload() {
  const dispatch = useDispatch();

  const handleChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const result = await dispatch(uploadResume(file));

    if (uploadResume.fulfilled.match(result)) {
      toast.success("Resume uploaded");
    } else {
      toast.error(result.payload);
    }
  };

  return (
    <label className="cursor-pointer inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
      Upload Resume
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleChange}
        className="hidden"
      />
    </label>
  );
}

export default ResumeUpload;
