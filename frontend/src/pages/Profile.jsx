


import { useEffect, useState } from "react";
import {
  getCurrentUser,
  uploadIntroVideo,
  updateProfile,
  uploadAvatar,
  deleteMyAccount,
} from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Loader from "../Components/Loader";
import { CgProfile } from "react-icons/cg";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    bio: "",
  });
  const [passwordData, setPasswordData] = useState({ password: "" });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const token = localStorage.getItem("token");
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Fetch  user
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const res = await getCurrentUser(token);
        setUser(res.data);
        setProfileData({
          name: res.data.name || "",
          email: res.data.email || "",
          bio: res.data.bio || "",
        });
      } catch (err) {
        alert("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!user) return <p className="text-center mt-10">User not found</p>;

  const handleProfileChange = (e) =>
    setProfileData({ ...profileData, [e.target.name]: e.target.value });

  const handlePasswordChange = (e) =>
    setPasswordData({ password: e.target.value });

  const handleProfileUpdate = async () => {
    try {
      await updateProfile(profileData, token);
      alert("Profile updated");
      const res = await getCurrentUser(token);
      setUser(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  const handlePasswordUpdate = async () => {
    if (!passwordData.password) return alert("Password cannot be empty");
    try {
      await updateProfile(passwordData, token);
      alert("Password changed");
      setPasswordData({ password: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to change password");
    }
  };

  // Avatar
  const handleAvatarSelect = (file) => {
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return alert("Select an image");
    const form = new FormData();
    form.append("avatar", avatarFile);
    try {
      await uploadAvatar(form, token);
      const res = await getCurrentUser(token);
      setUser(res.data);
      setAvatarFile(null);
      setAvatarPreview(null);
      alert("Avatar uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to upload avatar");
    }
  };

  // Intro video
  const handleVideoSelect = (file) => {
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleVideoUpload = async () => {
    if (!videoFile) return alert("Select a video");
    const form = new FormData();
    form.append("video", videoFile);
    try {
      await uploadIntroVideo(form, token);
      const res = await getCurrentUser(token);
      setUser(res.data);
      setVideoFile(null);
      setVideoPreview(null);
      alert("Intro video uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to upload intro video");
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    try {
      setDeleteLoading(true);
      await deleteMyAccount(token);
      logout();
      navigate("/signup");
    } catch (err) {
      console.error(err);
      alert("Failed to delete account");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 min-h-screen">
      {/* Profile hader */}
      <div className="bg-blue-500 text-white rounded-xl p-6 mb-6 flex gap-6 items-center">
        <div className="w-28 h-28 rounded-full border-4 border-white overflow-hidden relative group">
          {avatarPreview || user.avatar ? (
            <img
              src={avatarPreview || `http://localhost:5000/${user.avatar}`}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white text-gray-400 text-7xl">
              <CgProfile />
            </div>
          )}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition">
            <label className="text-white text-sm cursor-pointer flex flex-col items-center">
              <span>Change</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleAvatarSelect(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p>{user.email}</p>
          <span className="mt-2 inline-block bg-white/20 px-2 py-1 rounded">
            {user.role}
          </span>
        </div>
      </div>

      {/* Upload Avatar */}
      {avatarFile && (
        <button
          onClick={handleAvatarUpload}
          className="bg-green-600 text-white px-4 py-2 rounded mb-6 hover:bg-green-700"
        >
          Upload Avatar
        </button>
      )}

      {/* Profile info */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Profile Info</h2>
        <input
          name="name"
          value={profileData.name}
          onChange={handleProfileChange}
          placeholder="Name"
          className="w-full border p-2 rounded mb-3"
        />
        <input
          name="email"
          value={profileData.email}
          onChange={handleProfileChange}
          placeholder="Email"
          className="w-full border p-2 rounded mb-3"
        />
        <textarea
          name="bio"
          value={profileData.bio}
          onChange={handleProfileChange}
          placeholder="Bio"
          rows="3"
          className="w-full border p-2 rounded mb-4"
        />
        <button
          onClick={handleProfileUpdate}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Save Profile
        </button>
      </div>

      {/* Change password */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <input
          type="password"
          placeholder="New Password"
          value={passwordData.password}
          onChange={handlePasswordChange}
          className="w-full border p-2 rounded mb-4"
        />
        <button
          onClick={handlePasswordUpdate}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Update Password
        </button>
      </div>

      {/* Intro video */}
      {user.role === "talent" && (
        <div className="bg-white rounded-xl shadow p-6 mb-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Intro Video</h2>
          {videoPreview && (
            <video
              controls
              src={videoPreview}
              className="mx-auto mb-4 max-w-lg rounded"
            />
          )}
          {!videoPreview && user.introVideo && (
            <video controls className="mx-auto mb-4 max-w-lg rounded">
              <source
                src={`http://localhost:5000/${user.introVideo}`}
                type="video/mp4"
              />
            </video>
          )}
          <input
            type="file"
            accept="video/*"
            onChange={(e) => handleVideoSelect(e.target.files[0])}
          />
          <button
            onClick={handleVideoUpload}
            className="bg-blue-600 text-white px-4 py-2 rounded mt-2 hover:bg-blue-700"
          >
            Upload Video
          </button>
        </div>
      )}

      {/* Danger Zone */}
      <div className="bg-white border border-red-300 rounded-xl p-6 mb-10">
        <h2 className="text-xl font-semibold text-red-600 mb-2">
          Danger Zone
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Deleting your account is permanent and cannot be undone.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete My Account
        </button>
      </div>

      {/* Delete modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-red-600 mb-3">
              Confirm Account Deletion
            </h2>

            <p className="text-sm text-gray-600 mb-4">
              This action will permanently deactivate your account.
            </p>

            <label className="flex gap-2 text-sm mb-4">
              <input
                type="checkbox"
                checked={confirmChecked}
                onChange={(e) => setConfirmChecked(e.target.checked)}
              />
              I understand this action cannot be undone
            </label>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                disabled={!confirmChecked}
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
