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
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50 dark:from-zinc-900 dark:via-black dark:to-zinc-900 flex pb-16 md:pb-0 transition-all duration-300">
      {/* Icon Sidebar */}
      <Sidebar />

      {/* Dynamic Panel */}
      {activePanel && (
        <div className="w-80 border-r border-zinc-200/50 dark:border-zinc-800/50 hidden md:block bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl transition-all duration-300">
          {renderPanel()}
        </div>
      )}

      {/* Main Content */}
      <MainContent>{children}</MainContent>
    </div>
  );
};

export default MainLayout;
