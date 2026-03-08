import ChatHeader from "./components/chat-header";
import MessageBar from "./components/message-bar";
import MessageContainer from "./components/message-container";

const ChatContainer = () => {
  return (
    <div
      className="fixed top-0 h-[100vh] w-[100vw] flex flex-col md:static md:flex-1"
      style={{ background: "var(--aura-bg)" }}
    >
      <ChatHeader />
      <MessageContainer />
      <MessageBar />
    </div>
  );
};

export default ChatContainer;
