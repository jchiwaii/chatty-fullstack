import { useChat } from "../store/useChat";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChat();

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
      </div>
    </div>
  );
};
export default HomePage;
