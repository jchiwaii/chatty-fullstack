import { useState } from "react";
import { useAuth } from "../store/useAuth";
import { Camera, Mail, User, Edit2, Save, X, Lock } from "lucide-react";
import MainLayout from "../components/Layout/MainLayout";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile, changePassword } = useAuth();
  const [selectedImg, setSelectedImg] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    username: authUser?.username || "",
    email: authUser?.email || "",
    bio: authUser?.bio || "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Function to compress image before upload
  const compressImage = (file, maxWidth = 400, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        // Draw and compress
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(resolve, "image/jpeg", quality);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Compress the image first
      const compressedFile = await compressImage(file);

      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);

      reader.onload = async () => {
        const base64Image = reader.result;
        setSelectedImg(base64Image);

        try {
          await updateProfile({ profilePicture: base64Image });
        } catch (error) {
          console.error("Profile update failed:", error);
          // Reset the selected image on error
          setSelectedImg(null);
        }
      };
    } catch (error) {
      console.error("Image compression failed:", error);
      console.error("Failed to process image. Please try a smaller image.");
    }
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile(editedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditedProfile({
      username: authUser?.username || "",
      email: authUser?.email || "",
      bio: authUser?.bio || "",
    });
    setIsEditing(false);
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangingPassword(false);
    } catch (error) {
      console.error("Password change failed:", error);
    }
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-full bg-gray-50 p-6">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
            <p className="mt-2 text-gray-600">
              Manage your account information
            </p>
          </div>

          {/* Avatar upload section */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="relative">
              <img
                src={selectedImg || authUser?.profilePicture || "/avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
                onError={(e) => {
                  e.target.src =
                    "https://placehold.co/128x128/f3f4f6/6b7280?text=U";
                }}
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-black hover:bg-gray-800 p-2 rounded-full cursor-pointer transition-all duration-200 ${
                  isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                }`}
              >
                <Camera className="w-5 h-5 text-white" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-gray-500">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* Edit Button */}
          <div className="flex justify-end mb-6">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSaveProfile}
                  disabled={isUpdatingProfile}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={isUpdatingProfile}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <User className="w-4 h-4" />
                Username
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.username}
                  onChange={(e) =>
                    setEditedProfile({ ...editedProfile, username: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-900">{authUser?.username}</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              {isEditing ? (
                <input
                  type="email"
                  value={editedProfile.email}
                  onChange={(e) =>
                    setEditedProfile({ ...editedProfile, email: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-900">{authUser?.email}</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <User className="w-4 h-4" />
                Bio
              </div>
              {isEditing ? (
                <textarea
                  value={editedProfile.bio}
                  onChange={(e) =>
                    setEditedProfile({ ...editedProfile, bio: e.target.value })
                  }
                  maxLength={200}
                  rows={3}
                  className="w-full px-4 py-3 bg-white rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none resize-none"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[80px]">
                  <p className="text-gray-900">
                    {authUser?.bio || "No bio yet"}
                  </p>
                </div>
              )}
              {isEditing && (
                <p className="text-xs text-gray-500 text-right">
                  {editedProfile.bio.length}/200
                </p>
              )}
            </div>
          </div>

          {/* Account Information */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Account Information
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Member Since</span>
                <span className="text-gray-900">
                  {authUser?.createdAt?.split("T")[0]}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Account Status</span>
                <span className="text-green-600 font-medium">Active</span>
              </div>
            </div>
          </div>

          {/* Password Change Section - Only for non-Google users */}
          {!authUser?.isGoogleUser && (
            <div className="mt-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Security</h2>
                {!isChangingPassword && (
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
                  >
                    <Lock className="w-4 h-4" />
                    Change Password
                  </button>
                )}
              </div>

              {isChangingPassword && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handlePasswordChange}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Update Password
                    </button>
                    <button
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordData({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                      }}
                      className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
