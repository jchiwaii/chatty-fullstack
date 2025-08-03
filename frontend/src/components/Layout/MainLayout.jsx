import React from "react";
import { useLayout } from "../../store/useLayout.jsx";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import ChatList from "../Chat/ChatList";
import ProfilePanel from "../Features/ProfilePanel";
import GroupsPanel from "../Features/GroupsPanel";
import ContactsPanel from "../Features/ContactsPanel";
import SettingsPanel from "../Features/SettingsPanel";

const MainLayout = ({ children }) => {
  const { activePanel } = useLayout();

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
    <div className="min-h-screen bg-gray-50 flex pb-16 md:pb-0">
      {/* Icon Sidebar */}
      <Sidebar />

      {/* Dynamic Panel */}
      {activePanel && (
        <div className="w-80 border-r border-gray-200 hidden md:block">
          {renderPanel()}
        </div>
      )}

      {/* Main Content */}
      <MainContent>{children}</MainContent>
    </div>
  );
};

export default MainLayout;
