import { useState } from "react";
import { useDispatch } from "react-redux";
import { uploadResume } from "../../features/profile/profileSlice";
import { toast } from "react-toastify";

function ResumeUpload() {
  const dispatch = useDispatch();

  const [error, setError] = useState("");

  const [uploading, setUploading] = useState(false);

  const MAX_SIZE = 2 * 1024 * 1024; 

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const handleChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setError("");

    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF, DOC, DOCX allowed");

      e.target.value = "";
      return;
    }

    if (file.size > MAX_SIZE) {
      setError("Max file size is 2MB");

      e.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const result = await dispatch(uploadResume(file));

      if (uploadResume.fulfilled.match(result)) {
        toast.success("Resume uploaded successfully");
      } else {
        setError(result.payload || "Resume upload failed");
      }
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="cursor-pointer inline-block bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition">
        {uploading ? "Uploading..." : "Upload Resume"}

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleChange}
          className="hidden"
          disabled={uploading}
        />
      </label>

      {error && <p className="text-red-500 text-sm max-w-xs">{error}</p>}
    </div>
  );
}

export default ResumeUpload;
