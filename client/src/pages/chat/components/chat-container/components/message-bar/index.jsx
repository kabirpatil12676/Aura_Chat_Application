import { IoSend } from "react-icons/io5";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/store";
import { useSocket } from "@/contexts/SocketContext";
import { MESSAGE_TYPES, UPLOAD_FILE } from "@/lib/constants";
import apiClient from "@/lib/api-client";

const MessageBar = () => {
  const emojiRef = useRef();
  const fileInputRef = useRef();
  const {
    selectedChatData,
    userInfo,
    selectedChatType,
    setIsUploading,
    setFileUploadProgress,
  } = useAppStore();
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const socket = useSocket();

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [emojiRef]);

  const handleAddEmoji = (emoji) => setMessage((msg) => msg + emoji.emoji);
  const handleMessageChange = (event) => setMessage(event.target.value);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: MESSAGE_TYPES.TEXT,
        audioUrl: undefined,
        fileUrl: undefined,
      });
    } else if (selectedChatType === "channel") {
      socket.emit("send-channel-message", {
        sender: userInfo.id,
        content: message,
        messageType: MESSAGE_TYPES.TEXT,
        audioUrl: undefined,
        fileUrl: undefined,
        channelId: selectedChatData._id,
      });
    }
    setMessage("");
  };

  const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);
        const response = await apiClient.post(UPLOAD_FILE, formData, {
          withCredentials: true,
          onUploadProgress: (data) => {
            setFileUploadProgress(Math.round((100 * data.loaded) / data.total));
          },
        });
        if (response.status === 200 && response.data) {
          setIsUploading(false);
          if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
              sender: userInfo.id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: MESSAGE_TYPES.FILE,
              audioUrl: undefined,
              fileUrl: response.data.filePath,
            });
          } else if (selectedChatType === "channel") {
            socket.emit("send-channel-message", {
              sender: userInfo.id,
              content: undefined,
              messageType: MESSAGE_TYPES.FILE,
              audioUrl: undefined,
              fileUrl: response.data.filePath,
              channelId: selectedChatData._id,
            });
          }
        }
      }
    } catch (error) {
      setIsUploading(false);
      console.log({ error });
    }
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  return (
    <div
      className="flex-shrink-0 flex items-center gap-3 px-4 py-3 glass-dark"
      style={{ borderTop: "1px solid rgba(124,58,237,0.15)" }}
    >
      {/* Input area */}
      <div
        className="flex-1 flex items-center gap-2 rounded-xl px-4 py-2 transition-all duration-200"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
        onFocus={() => {}}
      >
        <input
          id="message-input"
          type="text"
          className="flex-1 bg-transparent text-sm focus:outline-none py-1"
          placeholder="Type a message…"
          style={{ color: "var(--aura-text)" }}
          value={message}
          onChange={handleMessageChange}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />

        {/* Attachment */}
        <button
          id="attachment-btn"
          className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200"
          style={{ color: "var(--aura-muted)" }}
          onClick={handleAttachmentClick}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#a78bfa"; e.currentTarget.style.background = "rgba(124,58,237,0.15)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--aura-muted)"; e.currentTarget.style.background = "transparent"; }}
        >
          <GrAttachment size={16} />
        </button>
        <input type="file" className="hidden" ref={fileInputRef} onChange={handleAttachmentChange} />

        {/* Emoji */}
        <div className="relative" ref={emojiRef}>
          <button
            id="emoji-btn"
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200"
            style={{ color: "var(--aura-muted)" }}
            onClick={() => setEmojiPickerOpen((v) => !v)}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#fbbf24"; e.currentTarget.style.background = "rgba(251,191,36,0.12)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--aura-muted)"; e.currentTarget.style.background = "transparent"; }}
          >
            <RiEmojiStickerLine size={18} />
          </button>
          <div className="absolute bottom-12 right-0 z-50">
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>

      {/* Send button */}
      <button
        id="send-message-btn"
        className="aura-btn flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
        onClick={handleSendMessage}
      >
        <IoSend size={16} />
      </button>
    </div>
  );
};

export default MessageBar;
