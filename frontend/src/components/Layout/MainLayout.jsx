import React, { useEffect } from "react";
import { useLayout } from "../../store/useLayout.jsx";
import { useSocket } from "../../store/useSocket";
import { useChat } from "../../store/useChat";
import { useAuth } from "../../store/useAuth";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import ChatList from "../Chat/ChatList";
import ProfilePanel from "../Features/ProfilePanel";
import GroupsPanel from "../Features/GroupsPanel";
import ContactsPanel from "../Features/ContactsPanel";
import SettingsPanel from "../Features/SettingsPanel";

const MainLayout = ({ children }) => {
  const { activePanel } = useLayout();
  const { socket } = useSocket();
  const { addMessage, setUserTyping } = useChat();
  const { authUser } = useAuth();

  // Set up socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      addMessage(message);
    };

    const handleUserTyping = ({ userId, isTyping }) => {
      setUserTyping(userId, isTyping);
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("userTyping", handleUserTyping);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("userTyping", handleUserTyping);
    };
  }, [socket, addMessage, setUserTyping]);

  const renderPanel = () => {
    switch (activePanel) {
      case "chats":
        return <ChatList />;
      case "profile":
        return <ProfilePanel />;
      case "groups":
        return <GroupsPanel />;
      case "contacts":
        return <ContactsPanel />;
      case "settings":
        return <SettingsPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-white dark:bg-black flex overflow-hidden">
      {/* Icon Sidebar */}
      <Sidebar />

      {/* Dynamic Panel */}
      {activePanel && (
        <div className="w-80 border-r border-gray-200 dark:border-gray-800 hidden md:block bg-white dark:bg-black">
          {renderPanel()}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">{children}</div>
    </div>
  );
};

export default MainLayout;
