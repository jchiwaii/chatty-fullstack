import React, { useEffect, useState } from "react";
import { MessageSquare, Search, Plus, Filter } from "lucide-react";
import { useChat } from "../../store/useChat";
import { useSocket } from "../../store/useSocket";
import { motion, AnimatePresence } from "framer-motion";

const ChatList = () => {
  const {
    users,
    getUsers,
    isUsersLoading,
    selectedUser,
    setSelectedUser,
    getUnreadCount,
  } = useChat();
  const { isUserOnline } = useSocket();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredUsers(
        users.filter(
          (user) =>
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredUsers(users);
    }
  }, [users, searchQuery]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  if (isUsersLoading) {
    return (
      <div className="h-full flex flex-col bg-white dark:bg-black">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-black dark:text-white font-mono">
            Messages
          </h2>
        </div>

        {/* Loading skeleton */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
              <div className="flex-1">
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-black">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-black dark:text-white font-mono">
            Messages
          </h2>
          <div className="flex gap-1">
            <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded transition-all duration-200">
              <Filter className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded transition-all duration-200">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500 dark:text-zinc-400 p-8">
            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8" />
            </div>
            <p className="text-lg font-medium mb-2">
              {searchQuery ? "No results found" : "No conversations yet"}
            </p>
            <p className="text-sm text-center">
              {searchQuery
                ? "Try searching with different keywords"
                : "Start a conversation with someone to see them here"}
            </p>
          </div>
        ) : (
          <div className="p-2">
            <AnimatePresence>
              {filteredUsers.map((user, index) => {
                const isOnline = isUserOnline(user._id);
                const unreadCount = getUnreadCount(user._id);
                const isSelected = selectedUser?._id === user._id;

                return (
                  <motion.div
                    key={user._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleUserSelect(user)}
                    className={`relative p-4 rounded-xl cursor-pointer transition-all duration-200 mb-2 ${
                      isSelected
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800"
                        : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="relative">
                        <img
                          src={user.profilePicture || "/avatar.png"}
                          alt={user.username}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-zinc-800 shadow-sm"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${user.username}&background=18181b&color=ffffff&size=48`;
                          }}
                        />
                        {/* Online indicator with pulse */}
                        {isOnline && (
                          <div className="absolute -bottom-1 -right-1">
                            <div className="w-4 h-4 bg-green-500 rounded-full ring-2 ring-white dark:ring-zinc-800"></div>
                            <div className="absolute inset-0 w-4 h-4 bg-green-500 rounded-full animate-ping opacity-75"></div>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                            {user.username}
                          </h3>
                          <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="min-w-[20px] h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1.5"
                              >
                                {unreadCount > 99 ? "99+" : unreadCount}
                              </motion.div>
                            )}
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                              {isOnline ? "Online" : "Offline"}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* Selection indicator */}
                    {isSelected && (
                      <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full"
                      />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
