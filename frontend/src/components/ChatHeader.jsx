import { X } from "lucide-react";
import { useAuth } from "../store/useAuth";
import { useChat } from "../store/useChat";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChat();
  const { onlineUsers } = useAuth();

  return (
    <div className="p-4 border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative">
            <img
              src={selectedUser.profilePicture || "/avatar.png"}
              alt={selectedUser.username}
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.target.src = `https://placehold.co/40x40/f3f4f6/6b7280?text=${
                  selectedUser.username?.charAt(0).toUpperCase() || "U"
                }`;
              }}
            />
            {/* Online indicator */}
            {onlineUsers?.includes(selectedUser._id) && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium text-gray-900">
              {selectedUser.username}
            </h3>
            <p className="text-sm text-gray-500">
              {onlineUsers?.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={() => setSelectedUser(null)}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
