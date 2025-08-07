import React, { useEffect } from "react";
import { useChat } from "../store/useChat";
import { useLayout } from "../store/useLayout.jsx";
import MainLayout from "../components/Layout/MainLayout";
import EmptyState from "../components/Chat/EmptyState";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChat();
  const { setActivePanel } = useLayout();

  // Set default panel to chats when component mounts
  useEffect(() => {
    setActivePanel("chats");
  }, [setActivePanel]);

  return (
    <MainLayout>
      {!selectedUser ? <EmptyState /> : <ChatContainer />}
    </MainLayout>
  );
};

export default HomePage;
