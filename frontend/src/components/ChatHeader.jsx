import { X, Phone, Video, MoreVertical, Info } from "lucide-react";
import { useAuth } from "../store/useAuth";
import { useChat } from "../store/useChat";
import { useSocket } from "../store/useSocket";
import { motion } from "framer-motion";
import { useState } from "react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, typingUsers } = useChat();
  const { onlineUsers } = useAuth();
  const { isUserOnline } = useSocket();
  const [showDropdown, setShowDropdown] = useState(false);

  const isOnline = isUserOnline(selectedUser?._id);
  const isTyping = typingUsers.has(selectedUser?._id);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            <img
              src={selectedUser.profilePicture || "/avatar.png"}
              alt={selectedUser.username}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-zinc-800 shadow-sm"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${selectedUser.username}&background=18181b&color=ffffff&size=48`;
              }}
            />
            {/* Online indicator with pulse animation */}
            {isOnline && (
              <div className="absolute -bottom-1 -right-1">
                <div className="w-4 h-4 bg-green-500 rounded-full ring-2 ring-white dark:ring-zinc-800"></div>
                <div className="absolute inset-0 w-4 h-4 bg-green-500 rounded-full animate-ping opacity-75"></div>
              </div>
            )}
          </div>

          {/* User info */}
          <div className="flex-1">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-lg">
              {selectedUser.username}
            </h3>
            <div className="flex items-center gap-2">
              {isTyping ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-blue-600 dark:text-blue-400 font-medium"
                >
                  typing...
                </motion.p>
              ) : (
                <p
                  className={`text-sm ${
                    isOnline
                      ? "text-green-600 dark:text-green-400"
                      : "text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  {isOnline ? "Online" : "Last seen recently"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all duration-200">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all duration-200">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all duration-200">
            <Info className="w-5 h-5" />
          </button>

          {/* More options dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all duration-200"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 py-2 z-50"
              >
                <button className="w-full px-4 py-2 text-left text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
                  View Profile
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
                  Mute Notifications
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
                  Clear Chat
                </button>
                <hr className="my-2 border-zinc-200 dark:border-zinc-700" />
                <button className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  Block User
                </button>
              </motion.div>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={() => setSelectedUser(null)}
            className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all duration-200 md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatHeader;
