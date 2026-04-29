import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyProfile } from "../../features/profile/profileSlice";
import EditProfileModal from "./EditProfileModal";
import AvatarUpload from "./AvatarUpload";
import ResumeUpload from "./ResumeUpload";

function ProfilePage() {
  const dispatch = useDispatch();
  const [openEdit, setOpenEdit] = useState(false);

  const { profile, completion, loading, error } = useSelector(
    (state) => state.profile,
  );

  useEffect(() => {
    dispatch(getMyProfile());
  }, [dispatch]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  if (error) return <div className="p-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center gap-5">
          <div>
            <img
              src={
                profile?.profileImage?.url || "https://via.placeholder.com/120"
              }
              alt="avatar"
              className="w-24 h-24 rounded-full object-cover"
            />
            <AvatarUpload />
          </div>

          <div>
            <h1 className="text-2xl font-bold">
              {profile?.user?.name}{" "}
              <button
                onClick={() => setOpenEdit(true)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
              >
                Edit Profile
              </button>
            </h1>

            <p className="text-gray-500">{profile?.user?.email}</p>

            <p className="mt-2 text-sm text-blue-600">
              Completion:
              {completion?.percentage || 0}%
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="font-semibold text-lg">Bio</h2>

          <p className="text-gray-700 mt-1">{profile?.bio || "No bio added"}</p>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Resume</h2>

          {profile?.resume?.url ? (
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-sm text-gray-700">
                {profile?.resume?.fileName || "Uploaded Resume"}
              </p>

              <a
                href={profile.resume.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                View Resume
              </a>

              <ResumeUpload />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <p>No resume uploaded</p>
              <ResumeUpload />
            </div>
          )}
        </div>

        <div className="mt-6">
          <h2 className="font-semibold text-lg">Skills</h2>

          <div className="flex gap-2 flex-wrap mt-2">
            {profile?.skills?.length > 0 ? (
              profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p>No skills</p>
            )}
          </div>
        </div>
      </div>

      {openEdit && (
        <EditProfileModal
          profile={profile}
          onClose={() => setOpenEdit(false)}
        />
      )}
    </div>
  );
}

export default ProfilePage;
