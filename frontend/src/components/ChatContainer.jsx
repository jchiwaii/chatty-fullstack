import { useChat } from "../store/useChat";
import { useSocket } from "../store/useSocket";
import { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuth } from "../store/useAuth";
import { formatMessageTime } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CheckCheck, Clock } from "lucide-react";

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
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex gap-3 max-w-xs lg:max-w-md ${
        isOwn ? "flex-row-reverse ml-auto" : "flex-row mr-auto"
      }`}
    >
      {/* Avatar */}
      <div className="relative">
        <img
          src={user?.profilePicture || "/avatar.png"}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-zinc-800 shadow-sm"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${user?.username}&background=18181b&color=ffffff&size=40`;
          }}
        />
        {/* Online indicator */}
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white dark:ring-zinc-800"></div>
      </div>

      {/* Message bubble */}
      <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
        <div
          className={`relative px-4 py-3 rounded-2xl shadow-sm ${
            isOwn
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-sm"
              : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-sm border border-zinc-200 dark:border-zinc-700"
          }`}
        >
          {message.image && (
            <div className="relative mb-2">
              {!imageLoaded && (
                <div className="w-48 h-32 bg-zinc-200 dark:bg-zinc-700 rounded-lg animate-pulse"></div>
              )}
              <img
                src={message.image}
                alt="Attachment"
                className={`max-w-[200px] rounded-lg transition-opacity duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0 absolute inset-0"
                }`}
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          )}
          {message.text && (
            <p className="text-sm leading-relaxed break-words">
              {message.text}
            </p>
          )}

          {/* Message status for own messages */}
          {isOwn && (
            <div className="flex items-center justify-end mt-1 gap-1">
              <span className="text-xs opacity-70">
                {formatMessageTime(message.createdAt)}
              </span>
              {message.status === "sent" && (
                <Check className="w-3 h-3 opacity-70" />
              )}
              {message.status === "delivered" && (
                <CheckCheck className="w-3 h-3 opacity-70" />
              )}
              {message.status === "read" && (
                <CheckCheck className="w-3 h-3 text-blue-300" />
              )}
              {!message.status && <Clock className="w-3 h-3 opacity-50" />}
            </div>
          )}
        </div>

        {/* Timestamp for received messages */}
        {!isOwn && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 px-2">
            {formatMessageTime(message.createdAt)}
          </span>
        )}
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
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser?._id, getMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isLoadingMessages) {
    return (
      <div className="flex-1 flex flex-col overflow-auto bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-900 dark:to-black">
        <ChatHeader />
        <div className="flex-1 overflow-y-auto p-6">
          <MessageSkeleton />
        </div>
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-gradient-to-b from-white via-zinc-50/50 to-white dark:from-zinc-900 dark:via-black/50 dark:to-zinc-900">
      <ChatHeader />

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none'%3e%3ccircle cx='16' cy='16' r='0.5' fill='%23e4e4e7' opacity='0.3'/%3e%3c/svg%3e")`,
        }}
      >
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
