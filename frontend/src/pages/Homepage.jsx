import React from "react";
import { useChat } from "../store/useChat";
import MainLayout from "../components/Layout/MainLayout";
import EmptyState from "../components/Chat/EmptyState";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChat();

  return (
    <MainLayout>
      <div className="flex h-full">
        {/* Main Chat Area */}
        <div className="flex-1">
          {!selectedUser ? <EmptyState /> : <ChatContainer />}
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;
