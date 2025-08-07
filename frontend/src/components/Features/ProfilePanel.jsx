import React from "react";
import { useAuth } from "../../store/useAuth";
import { User, Mail, Calendar, Shield } from "lucide-react";

const ProfilePanel = () => {
  const { authUser } = useAuth();

  return (
    <div className="h-full flex flex-col bg-white dark:bg-black">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-h2 text-black dark:text-white">Profile</h2>
      </div>

      {/* Profile Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={authUser?.profilePicture || "/avatar.png"}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${
                  authUser?.username || "U"
                }&background=000000&color=ffffff&size=64`;
              }}
            />
          </div>
          <h3 className="mt-3 text-h3 text-black dark:text-white">
            {authUser?.username || "User"}
          </h3>
          <p className="text-small text-gray-500 dark:text-gray-400">Online</p>
        </div>

        {/* Profile Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-800">
            <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <div>
              <p className="text-small text-black dark:text-white font-medium">
                Username
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {authUser?.username || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-800">
            <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <div>
              <p className="text-small text-black dark:text-white font-medium">
                Email
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {authUser?.email || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-800">
            <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <div>
              <p className="text-small text-black dark:text-white font-medium">
                Member Since
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {authUser?.createdAt
                  ? new Date(authUser.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-800">
            <Shield className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <div>
              <p className="text-small text-black dark:text-white font-medium">
                Status
              </p>
              <p className="text-xs text-black dark:text-white">Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;
