import React, { useEffect } from "react";
import { MessageSquare, Users } from "lucide-react";
import { useChat } from "../../store/useChat";

const ChatList = () => {
  const { users, getUsers, isUsersLoading, selectedUser, setSelectedUser } = useChat();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  if (isUsersLoading) {
    return (
      <div className="h-full flex flex-col bg-white">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
        </div>
        
        {/* Loading skeleton */}
        <div className="flex-1 overflow-y-auto p-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-4 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageSquare className="w-12 h-12 mb-4" />
            <p className="text-lg font-medium">No users found</p>
            <p className="text-sm">Start by adding some friends to chat with</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {users.map((user) => (
              <div
                key={user._id}
                onClick={() => handleUserSelect(user)}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedUser?._id === user._id ? "bg-gray-50 border-r-2 border-black" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <img
                      src={user.profilePicture || "/avatar.png"}
                      alt={user.username}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://placehold.co/48x48/f3f4f6/6b7280?text=${user.username.charAt(0).toUpperCase()}`;
                      }}
                    />
                    {/* Online indicator - you can add online status logic later */}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 truncate">
                        {user.username}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {/* You can add last message time here later */}
                        Online
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
