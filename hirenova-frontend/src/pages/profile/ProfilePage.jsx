import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getMyProfile,
  deleteAvatar,
  deleteResume,
} from "../../features/profile/profileSlice";

import EditProfileModal from "./EditProfileModal";
import AvatarUpload from "./AvatarUpload";
import ResumeUpload from "./ResumeUpload";
import CreateProfileForm from "./CreateProfileForm";

function ProfilePage() {
  const dispatch = useDispatch();

  const [openEdit, setOpenEdit] = useState(false);

  const { profile, completion, loading, error } = useSelector(
    (state) => state.profile,
  );

  useEffect(() => {
    dispatch(getMyProfile());
  }, [dispatch]);

  // Loader
  if (loading && !profile) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  // If profile not found
  if (error === "Profile not found") {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <CreateProfileForm />
      </div>
    );
  }

  // Other errors
  if (error) {
    return <div className="p-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
          {/* Left */}
          <div className="flex gap-5 items-center">
            <div>
              <img
                src={profile?.profileImage?.url}
                alt="avatar"
                className="w-24 h-24 rounded-full object-cover"
              />

              <div className="mt-2 space-y-2">
                <AvatarUpload />

                {profile?.profileImage?.url && (
                  <button
                    onClick={() => dispatch(deleteAvatar())}
                    className="text-red-500 text-sm"
                  >
                    Delete Photo
                  </button>
                )}
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-bold">{profile?.user?.name}</h1>

              <p className="text-gray-500">{profile?.user?.email}</p>

              <p className="mt-2 text-sm text-blue-600">
                Completion: {completion?.percentage || 0}%
              </p>
            </div>
          </div>

          {/* Right */}
          <div>
            <button
              onClick={() => setOpenEdit(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-8">
          <h2 className="font-semibold text-lg">Bio</h2>

          <p className="text-gray-700 mt-1">{profile?.bio || "No bio added"}</p>
        </div>

        {/* Resume */}
        <div className="mt-8">
          <h2 className="font-semibold text-lg mb-2">Resume</h2>

          {profile?.resume?.url ? (
            <div className="flex gap-3 flex-wrap items-center">
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

              <button
                onClick={() => dispatch(deleteResume())}
                className="text-red-500 text-sm"
              >
                Delete Resume
              </button>
            </div>
          ) : (
            <div className="flex gap-3 items-center">
              <p>No resume uploaded</p>
              <ResumeUpload />
            </div>
          )}
        </div>

        {/* Skills */}
        <div className="mt-8">
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
              <p>No skills added</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
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
