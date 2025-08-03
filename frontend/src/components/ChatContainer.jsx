import { useChat } from "../store/useChat";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuth } from "../store/useAuth";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const { messages, getMessages, isLoadingMessages, selectedUser } = useChat();
  const { authUser } = useAuth();
  const messageEndRef = useRef(null);

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
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <div className="flex-1 overflow-y-auto p-4">
          <MessageSkeleton />
        </div>
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-white">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`flex ${
              message.sender === authUser._id ? "justify-end" : "justify-start"
            }`}
          >
            <div className={`flex gap-3 max-w-xs lg:max-w-md ${
              message.sender === authUser._id ? "flex-row-reverse" : "flex-row"
            }`}>
              {/* Avatar */}
              <img
                src={
                  (message.sender === authUser._id
                    ? authUser.profilePicture
                    : selectedUser.profilePicture) || "/avatar.png"
                }
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => {
                  const user = message.sender === authUser._id ? authUser : selectedUser;
                  e.target.src = `https://placehold.co/32x32/f3f4f6/6b7280?text=${user.username?.charAt(0).toUpperCase() || 'U'}`;
                }}
              />
              
              {/* Message bubble */}
              <div className={`flex flex-col ${
                message.sender === authUser._id ? "items-end" : "items-start"
              }`}>
                <div className={`px-4 py-2 rounded-2xl ${
                  message.sender === authUser._id
                    ? "bg-black text-white rounded-br-sm"
                    : "bg-gray-100 text-gray-900 rounded-bl-sm"
                }`}>
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="max-w-[200px] rounded-lg mb-2"
                    />
                  )}
                  {message.text && (
                    <p className="text-sm">{message.text}</p>
                  )}
                </div>
                
                {/* Timestamp */}
                <span className="text-xs text-gray-500 mt-1 px-2">
                  {formatMessageTime(message.createdAt)}
                </span>
              </div>
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
