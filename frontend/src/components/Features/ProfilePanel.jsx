import React from "react";
import { useAuth } from "../../store/useAuth";
import { User, Mail, Calendar, Shield } from "lucide-react";

const ProfilePanel = () => {
  const { authUser } = useAuth();

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
      </div>

      {/* Profile Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={authUser?.profilePicture || "/avatar.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
              onError={(e) => {
                e.target.src =
                  "https://placehold.co/96x96/f3f4f6/6b7280?text=U";
              }}
            />
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            {authUser?.username || "User"}
          </h3>
          <p className="text-sm text-gray-500">Online</p>
        </div>

        {/* Profile Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <User className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Username</p>
              <p className="text-sm text-gray-600">
                {authUser?.username || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Email</p>
              <p className="text-sm text-gray-600">
                {authUser?.email || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Member Since</p>
              <p className="text-sm text-gray-600">
                {authUser?.createdAt
                  ? new Date(authUser.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Shield className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Account Status
              </p>
              <p className="text-sm text-green-600">Active</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 space-y-3">
          <button className="w-full p-3 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            Edit Profile
          </button>
          <button className="w-full p-3 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            Privacy Settings
          </button>
          <button className="w-full p-3 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            Account Security
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;
