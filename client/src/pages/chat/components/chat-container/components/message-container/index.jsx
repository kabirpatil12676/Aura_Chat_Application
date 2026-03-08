import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import apiClient from "@/lib/api-client";
import {
  FETCH_ALL_MESSAGES_ROUTE,
  GET_CHANNEL_MESSAGES,
  HOST,
  MESSAGE_TYPES,
} from "@/lib/constants";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { MdFolderZip } from "react-icons/md";

const MessageContainer = () => {
  const [showImage, setShowImage] = useState(false);
  const [imageURL, setImageURL] = useState(null);
  const {
    selectedChatData,
    setSelectedChatMessages,
    selectedChatMessages,
    selectedChatType,
    userInfo,
    setDownloadProgress,
    setIsDownloading,
  } = useAppStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    const getMessages = async () => {
      const response = await apiClient.post(
        FETCH_ALL_MESSAGES_ROUTE,
        { id: selectedChatData._id },
        { withCredentials: true }
      );
      if (response.data.messages) setSelectedChatMessages(response.data.messages);
    };
    const getChannelMessages = async () => {
      const response = await apiClient.get(
        `${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`,
        { withCredentials: true }
      );
      if (response.data.messages) setSelectedChatMessages(response.data.messages);
    };
    if (selectedChatData._id) {
      if (selectedChatType === "contact") getMessages();
      else if (selectedChatType === "channel") getChannelMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const checkIfImage = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const downloadFile = async (url) => {
    setIsDownloading(true);
    setDownloadProgress(0);
    const response = await apiClient.get(`${HOST}/${url}`, {
      responseType: "blob",
      onDownloadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        setDownloadProgress(Math.round((loaded * 100) / total));
      },
    });
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", url.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    setIsDownloading(false);
    setDownloadProgress(0);
  };

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
              <span className="text-xs px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.05)", color: "var(--aura-muted)" }}>
                {moment(message.timestamp).format("LL")}
              </span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            </div>
          )}
          {selectedChatType === "contact" && renderPersonalMessages(message)}
          {selectedChatType === "channel" && renderChannelMessages(message)}
        </div>
      );
    });
  };

  const isSentByMe = (message) => {
    if (selectedChatType === "contact") return message.sender !== selectedChatData._id;
    return message.sender._id === userInfo.id;
  };

  const renderPersonalMessages = (message) => {
    const sent = message.sender !== selectedChatData._id;
    return (
      <div className={`flex mb-2 ${sent ? "justify-end" : "justify-start"}`}>
        <div className={`max-w-[65%] flex flex-col ${sent ? "items-end" : "items-start"}`}>
          {message.messageType === MESSAGE_TYPES.TEXT && (
            <div
              className="px-4 py-2.5 text-sm leading-relaxed"
              style={
                sent
                  ? {
                      background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                      color: "#fff",
                      borderRadius: "1.25rem 1.25rem 0.25rem 1.25rem",
                    }
                  : {
                      background: "rgba(255,255,255,0.06)",
                      color: "var(--aura-text)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "1.25rem 1.25rem 1.25rem 0.25rem",
                    }
              }
            >
              {message.content}
            </div>
          )}
          {message.messageType === MESSAGE_TYPES.FILE && (
            <div
              className="px-4 py-2.5"
              style={
                sent
                  ? {
                      background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                      borderRadius: "1.25rem 1.25rem 0.25rem 1.25rem",
                    }
                  : {
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "1.25rem 1.25rem 1.25rem 0.25rem",
                    }
              }
            >
              {checkIfImage(message.fileUrl) ? (
                <div
                  className="cursor-pointer rounded-lg overflow-hidden"
                  onClick={() => { setShowImage(true); setImageURL(message.fileUrl); }}
                >
                  <img src={`${HOST}/${message.fileUrl}`} alt="" className="max-w-[250px] rounded-lg" />
                </div>
              ) : (
                <div className="flex items-center gap-3 text-sm" style={{ color: "#fff" }}>
                  <MdFolderZip size={24} />
                  <span className="truncate max-w-[150px]">{message.fileUrl.split("/").pop()}</span>
                  <button className="hover:opacity-70 transition-opacity" onClick={() => downloadFile(message.fileUrl)}>
                    <IoMdArrowRoundDown size={18} />
                  </button>
                </div>
              )}
            </div>
          )}
          <span className="text-xs mt-1 px-1" style={{ color: "var(--aura-muted)" }}>
            {moment(message.timestamp).format("LT")}
          </span>
        </div>
      </div>
    );
  };

  const renderChannelMessages = (message) => {
    const sent = message.sender._id === userInfo.id;
    return (
      <div className={`flex mb-3 ${sent ? "justify-end" : "justify-start"}`}>
        <div className={`max-w-[65%] flex flex-col ${sent ? "items-end" : "items-start"} gap-1`}>
          {/* Sender info for messages not from me */}
          {!sent && (
            <div className="flex items-center gap-2 ml-1">
              <Avatar className="h-6 w-6">
                {message.sender.image && (
                  <AvatarImage src={`${HOST}/${message.sender.image}`} alt="profile" className="rounded-full" />
                )}
                <AvatarFallback
                  className={`uppercase h-6 w-6 text-xs flex ${getColor(message.sender.color)} items-center justify-center rounded-full`}
                >
                  {message.sender.firstName.split("").shift()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium" style={{ color: "#a78bfa" }}>
                {`${message.sender.firstName} ${message.sender.lastName}`}
              </span>
            </div>
          )}

          {/* Message bubble */}
          {message.messageType === MESSAGE_TYPES.TEXT && (
            <div
              className="px-4 py-2.5 text-sm leading-relaxed"
              style={
                sent
                  ? {
                      background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                      color: "#fff",
                      borderRadius: "1.25rem 1.25rem 0.25rem 1.25rem",
                    }
                  : {
                      background: "rgba(255,255,255,0.06)",
                      color: "var(--aura-text)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "1.25rem 1.25rem 1.25rem 0.25rem",
                    }
              }
            >
              {message.content}
            </div>
          )}
          {message.messageType === MESSAGE_TYPES.FILE && (
            <div
              className="px-4 py-2.5"
              style={
                sent
                  ? {
                      background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                      borderRadius: "1.25rem 1.25rem 0.25rem 1.25rem",
                    }
                  : {
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "1.25rem 1.25rem 1.25rem 0.25rem",
                    }
              }
            >
              {checkIfImage(message.fileUrl) ? (
                <div
                  className="cursor-pointer rounded-lg overflow-hidden"
                  onClick={() => { setShowImage(true); setImageURL(message.fileUrl); }}
                >
                  <img src={`${HOST}/${message.fileUrl}`} alt="" className="max-w-[250px] rounded-lg" />
                </div>
              ) : (
                <div className="flex items-center gap-3 text-sm text-white">
                  <MdFolderZip size={24} />
                  <span className="truncate max-w-[150px]">{message.fileUrl.split("/").pop()}</span>
                  <button className="hover:opacity-70" onClick={() => downloadFile(message.fileUrl)}>
                    <IoMdArrowRoundDown size={18} />
                  </button>
                </div>
              )}
            </div>
          )}
          <span className="text-xs px-1" style={{ color: "var(--aura-muted)" }}>
            {moment(message.timestamp).format("LT")}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div
      className="flex-1 overflow-y-auto scrollbar-hidden px-4 md:px-8 py-4"
      style={{ background: "var(--aura-bg)" }}
    >
      {renderMessages()}
      <div ref={messageEndRef} />

      {/* Image lightbox */}
      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center flex-col glass-dark">
          <img src={`${HOST}/${imageURL}`} className="max-h-[80vh] max-w-[90vw] rounded-xl object-contain" alt="" />
          <div className="flex gap-3 mt-6">
            <button
              className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200"
              style={{ background: "rgba(255,255,255,0.08)", color: "var(--aura-text)" }}
              onClick={() => downloadFile(imageURL)}
            >
              <IoMdArrowRoundDown size={20} />
            </button>
            <button
              className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200"
              style={{ background: "rgba(239,68,68,0.15)", color: "#f87171" }}
              onClick={() => { setShowImage(false); setImageURL(null); }}
            >
              <IoCloseSharp size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
