import { useChat } from "../store/useChat";
import { useSocket } from "../store/useSocket";
import { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuth } from "../store/useAuth";
import { formatMessageTime } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CheckCheck, Clock, MessageSquare } from "lucide-react";

const TypingIndicator = ({ typingUsers, selectedUser }) => {
  const { authUser } = useAuth();

  if (!typingUsers.has(selectedUser?._id)) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex items-center gap-3 px-4 py-2"
    >
      <img
        src={selectedUser?.profilePicture || "/avatar.png"}
        alt="Avatar"
        className="w-8 h-8 rounded-full object-cover"
        onError={(e) => {
          e.target.src = `https://ui-avatars.com/api/?name=${selectedUser?.username}&background=18181b&color=ffffff&size=32`;
        }}
      />
      <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl px-4 py-2 rounded-bl-sm">
        <div className="flex gap-1">
          <div
            className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </motion.div>
  );
};

const MessageBubble = ({ message, isOwn, user, authUser }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`flex gap-2 max-w-xs lg:max-w-md ${
        isOwn ? "flex-row-reverse ml-auto" : "flex-row mr-auto"
      }`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <img
          src={user?.profilePicture || "/avatar.png"}
          alt="Avatar"
          className="w-8 h-8 rounded-full object-cover"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${user?.username}&background=000000&color=ffffff&size=32`;
          }}
        />
      </div>

      {/* Message bubble */}
      <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
        <div
          className={`relative px-3 py-2 rounded text-sm font-mono ${
            isOwn
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "bg-gray-100 text-black dark:bg-gray-900 dark:text-white border border-gray-200 dark:border-gray-800"
          }`}
        >
          {message.image && (
            <div className="relative mb-2">
              {!imageLoaded && (
                <div className="w-48 h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              )}
              <img
                src={message.image}
                alt="Attachment"
                className={`max-w-[200px] rounded transition-opacity duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0 absolute inset-0"
                }`}
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          )}
          {message.text && (
            <p className="leading-relaxed break-words">{message.text}</p>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-1 font-mono">
          {formatMessageTime(message.createdAt)}
        </span>
      </div>
    </motion.div>
  );
};

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isLoadingMessages,
    selectedUser,
    typingUsers,
  } = useChat();
  const { authUser } = useAuth();
  const { isUserOnline } = useSocket();
  const messageEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (messageEndRef.current && messages.length > 0) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Show loading state only when we have a selected user but are loading messages
  if (isLoadingMessages && selectedUser) {
    return (
      <div className="h-full flex flex-col bg-white dark:bg-black">
        <ChatHeader />
        <div className="flex-1 overflow-y-auto p-4">
          <MessageSkeleton />
        </div>
        <MessageInput />
      </div>
    );
  }

  // If no selected user, this shouldn't render (EmptyState should show instead)
  if (!selectedUser) {
    return null;
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-black">
      <ChatHeader />

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent"
      >
        {messages.length === 0 && !isLoadingMessages ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8" />
            </div>
            <p className="text-lg font-medium mb-2">No messages yet</p>
            <p className="text-sm text-center">
              Start the conversation with {selectedUser?.username}
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((message, index) => {
              const isOwn = message.sender === authUser._id;
              const user = isOwn ? authUser : selectedUser;

              return (
                <MessageBubble
                  key={message._id}
                  message={message}
                  isOwn={isOwn}
                  user={user}
                  authUser={authUser}
                />
              );
            })}
          </AnimatePresence>
        )}

        {/* Typing Indicator */}
        <AnimatePresence>
          <TypingIndicator
            typingUsers={typingUsers}
            selectedUser={selectedUser}
          />
        </AnimatePresence>

        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
