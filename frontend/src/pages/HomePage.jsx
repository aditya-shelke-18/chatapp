import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="chat-bg flex items-center justify-center px-4 pt-20 pb-4 min-h-screen">
      <div className="glass-card rounded-2xl w-full max-w-6xl h-[calc(100vh-6rem)] flex overflow-hidden">
        <Sidebar />
        {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
      </div>
    </div>
  );
};
export default HomePage;
