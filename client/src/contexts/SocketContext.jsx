import { SOCKET_HOST } from "@/lib/constants";
import { useAppStore } from "@/store";
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const { userInfo } = useAppStore();

  useEffect(() => {
    if (userInfo) {
      socket.current = io(SOCKET_HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });
      socket.current.on("connect", () => {
        console.log("Connected to socket server");
      });

      const handleReceiveMessage = (message) => {
        // Access the latest state values
        const {
          selectedChatData: currentChatData,
          selectedChatType: currentChatType,
          addMessage,
          addContactInDMContacts,
        } = useAppStore.getState();

        if (
          currentChatType !== undefined &&
          (currentChatData._id === message.sender._id ||
            currentChatData._id === message.recipient._id)
        ) {
          addMessage(message);
        } else {
          // Show toast notification for new message
          const senderName = message.sender.firstName
            ? `${message.sender.firstName} ${message.sender.lastName || ''}`
            : message.sender.email;
          const displayMessage = message.messageType === "file" ? "Sent a file" : message.content;
          toast.info(`New Message from ${senderName}`, {
            description: displayMessage,
          });
        }
        addContactInDMContacts(message);
      };

      const handleReceiveChannelMessage = (message) => {
        const {
          selectedChatData,
          selectedChatType,
          addMessage,
          addChannelInChannelLists,
        } = useAppStore.getState();

        if (
          selectedChatType !== undefined &&
          selectedChatData._id === message.channelId
        ) {
          addMessage(message);
        } else {
          // Show toast notification for new channel message
          const senderName = message.sender.firstName
            ? `${message.sender.firstName} ${message.sender.lastName || ''}`
            : message.sender.email;
          const displayMessage = message.messageType === "file" ? "Sent a file" : message.content;

          // Assuming we can find the channel name, or just display generic new message
          const channelName = useAppStore.getState().channels.find(c => c._id === message.channelId)?.name || 'a Channel';

          toast.info(`New Message in ${channelName}`, {
            description: `${senderName}: ${displayMessage}`,
          });
        }
        addChannelInChannelLists(message);
      };

      const addNewChannel = (channel) => {
        const { addChannel } = useAppStore.getState();
        addChannel(channel);
      };

      socket.current.on("receiveMessage", handleReceiveMessage);
      socket.current.on("recieve-channel-message", handleReceiveChannelMessage);
      socket.current.on("new-channel-added", addNewChannel);

      return () => {
        socket.current.disconnect();
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
