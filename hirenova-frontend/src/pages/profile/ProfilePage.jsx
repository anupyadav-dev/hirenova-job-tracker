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

import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";

function ProfilePage() {
  const dispatch = useDispatch();

  const [openEdit, setOpenEdit] = useState(false);

  const { profile, completion, loading, error } = useSelector(
    (state) => state.profile,
  );

  useEffect(() => {
    dispatch(getMyProfile());
  }, [dispatch]);

  if (loading && !profile) {
    return <Loader />;
  }

  if (error === "Profile not found") {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <CreateProfileForm />
      </div>
    );
  }

  if (error && !profile) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white shadow-xl rounded-3xl overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

        <div className="px-6 pb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-14 gap-5">
            <div className="flex items-end gap-5">
              <div>
                <img
                  src={
                    profile?.profileImage?.url ||
                    "https://via.placeholder.com/120"
                  }
                  alt="avatar"
                  className="w-28 h-28 rounded-full border-4 border-white object-cover shadow"
                />

                <div className="mt-3 space-y-2">
                  <AvatarUpload />

                  {profile?.profileImage?.url && (
                    <button
                      onClick={() => dispatch(deleteAvatar())}
                      className="block text-sm text-red-500"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>
              </div>

              <div className="pb-2">
                <h1 className="text-3xl font-bold">{profile?.user?.name}</h1>

                <p className="text-gray-500">{profile?.user?.email}</p>
              </div>
            </div>

            <button
              onClick={() => setOpenEdit(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl"
            >
              Edit Profile
            </button>
          </div>

          <div className="mt-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Profile Completion</span>

              <span>{completion?.percentage || 0}%</span>
            </div>

            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                style={{
                  width: `${completion?.percentage || 0}%`,
                }}
                className="h-full bg-blue-600"
              ></div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">About Me</h2>

            <p className="text-gray-700 leading-7">
              {profile?.bio || "No bio added yet."}
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3">Resume</h2>

            {profile?.resume?.url ? (
              <div className="flex flex-wrap gap-3 items-center">
                <span className="px-3 py-2 bg-gray-100 rounded-lg text-sm">
                  {profile?.resume?.fileName}
                </span>

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
                <span>No resume uploaded</span>
                <ResumeUpload />
              </div>
            )}
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3">Skills</h2>

            <div className="flex flex-wrap gap-3">
              {profile?.skills?.length > 0 ? (
                profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p>No skills added.</p>
              )}
            </div>
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
