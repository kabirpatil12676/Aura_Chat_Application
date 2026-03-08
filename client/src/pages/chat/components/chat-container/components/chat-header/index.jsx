import { RiCloseFill } from "react-icons/ri";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";
import { HOST } from "@/lib/constants";
import { getColor } from "@/lib/utils";

const ChatHeader = () => {
  const { selectedChatData, closeChat, selectedChatType } = useAppStore();

  return (
    <div
      className="h-[70px] flex items-center justify-between px-6 glass-dark flex-shrink-0"
      style={{ borderBottom: "1px solid rgba(124,58,237,0.15)" }}
    >
      {/* Left: Avatar + Name */}
      <div className="flex items-center gap-3">
        {/* Avatar / Channel icon */}
        <div className="relative">
          {selectedChatType === "contact" ? (
            <Avatar className="w-10 h-10 rounded-full overflow-hidden">
              {selectedChatData.image ? (
                <AvatarImage
                  src={`${HOST}/${selectedChatData.image}`}
                  alt="profile"
                  className="object-cover w-full h-full rounded-full"
                />
              ) : (
                <div
                  className={`uppercase w-10 h-10 text-sm font-semibold border ${getColor(
                    selectedChatData.color
                  )} flex items-center justify-center rounded-full`}
                >
                  {selectedChatData.firstName
                    ? selectedChatData.firstName.split("").shift()
                    : selectedChatData.email.split("").shift()}
                </div>
              )}
            </Avatar>
          ) : (
            <div
              className="w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                color: "#fff",
              }}
            >
              #
            </div>
          )}
          {/* Online dot (contacts only) */}
          {selectedChatType === "contact" && (
            <span
              className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2"
              style={{ background: "#22c55e", borderColor: "var(--aura-bg)" }}
            />
          )}
        </div>

        {/* Name / Channel name */}
        <div>
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--aura-text)" }}
          >
            {selectedChatType === "channel" && selectedChatData.name}
            {selectedChatType === "contact" &&
              (selectedChatData.firstName && selectedChatData.lastName
                ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
                : selectedChatData.email)}
          </p>
          {selectedChatType === "contact" && (
            <p className="text-xs" style={{ color: "#22c55e" }}>Online</p>
          )}
          {selectedChatType === "channel" && (
            <p className="text-xs" style={{ color: "var(--aura-muted)" }}>Channel</p>
          )}
        </div>
      </div>

      {/* Right: Close */}
      <button
        id="close-chat-btn"
        className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
        style={{ color: "var(--aura-muted)" }}
        onClick={closeChat}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(239,68,68,0.12)";
          e.currentTarget.style.color = "#f87171";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--aura-muted)";
        }}
      >
        <RiCloseFill className="text-xl" />
      </button>
    </div>
  );
};

export default ChatHeader;
