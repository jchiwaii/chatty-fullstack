import { useState } from "react";
import { useAuth } from "../store/useAuth";
import { Camera, Mail, User } from "lucide-react";
import MainLayout from "../components/Layout/MainLayout";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuth();
  const [selectedImg, setSelectedImg] = useState(null);

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

          {/* Profile Information */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900">{authUser?.username}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900">{authUser?.email}</p>
              </div>
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
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
