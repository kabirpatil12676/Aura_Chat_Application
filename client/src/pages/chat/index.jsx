import { useEffect } from "react";
import ChatContainer from "./components/chat-container";
import ContactsContainer from "./components/contacts-container";
import { useAppStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import EmptyChatContainer from "./components/empty-chat-container";
import AuraOrb from "@/components/common/logo/AuraOrb";

const Chat = () => {
  const {
    userInfo,
    selectedChatType,
    isUploading,
    fileUploadProgress,
    isDownloading,
    downloadProgress,
  } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast("Please setup profile to continue.");
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return (
    <div className="flex h-[100vh] text-white overflow-hidden" style={{ background: "var(--aura-bg)" }}>
      {/* Upload progress overlay */}
      {isUploading && (
        <ProgressOverlay label="Uploading File" progress={fileUploadProgress} />
      )}

      {/* Download progress overlay */}
      {isDownloading && (
        <ProgressOverlay label="Downloading File" progress={downloadProgress} />
      )}

      <ContactsContainer />
      {selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <ChatContainer />
      )}
    </div>
  );
};

export default Chat;

// Reusable progress overlay
const ProgressOverlay = ({ label, progress }) => (
  <div
    className="h-[100vh] w-[100vw] fixed top-0 z-50 left-0 flex items-center justify-center flex-col gap-6 glass-dark"
    style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
  >
    {/* Animated orb */}
    <div className="animate-aura-pulse">
      <AuraOrb size={72} />
    </div>

    <div className="flex flex-col items-center gap-3">
      <h5 className="text-xl font-semibold" style={{ color: "var(--aura-text)", fontFamily: "'Inter', sans-serif" }}>
        {label}
      </h5>

      {/* Progress bar */}
      <div className="w-56 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, #7c3aed, #4f46e5, #a78bfa)",
          }}
        />
      </div>
      <span className="text-sm font-medium" style={{ color: "#a78bfa" }}>{progress}%</span>
    </div>
  </div>
);
