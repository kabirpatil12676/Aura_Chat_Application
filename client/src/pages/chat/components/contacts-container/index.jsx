import ContactList from "@/components/common/contact-list";
import Logo from "@/components/common/logo";
import ProfileInfo from "./components/profile-info";
import apiClient from "@/lib/api-client";
import {
  GET_CONTACTS_WITH_MESSAGES_ROUTE,
  GET_USER_CHANNELS,
} from "@/lib/constants";
import { useEffect } from "react";
import { useAppStore } from "@/store";
import NewDM from "./components/new-dm/new-dm";
import CreateChannel from "./components/create-channel/create-channel";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Shield } from "lucide-react";

const ContactsContainer = () => {
  const navigate = useNavigate();
  const {
    setDirectMessagesContacts,
    directMessagesContacts,
    channels,
    setChannels,
    userInfo,
  } = useAppStore();

  useEffect(() => {
    const getContactsWithMessages = async () => {
      const response = await apiClient.get(GET_CONTACTS_WITH_MESSAGES_ROUTE, { withCredentials: true });
      if (response.data.contacts) setDirectMessagesContacts(response.data.contacts);
    };
    getContactsWithMessages();
  }, [setDirectMessagesContacts]);

  useEffect(() => {
    const getChannels = async () => {
      const response = await apiClient.get(GET_USER_CHANNELS, { withCredentials: true });
      if (response.data.channels) setChannels(response.data.channels);
    };
    getChannels();
  }, [setChannels]);

  return (
    <div
      className="relative md:w-[35vw] lg:w-[30vw] xl:w-[22vw] w-full flex flex-col aura-sidebar-border"
      style={{ background: "var(--aura-surface)", minHeight: "100vh" }}
    >
      {/* Logo */}
      <div className="pt-2 pb-1">
        <Logo />
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "var(--aura-border)", margin: "0 16px" }} />

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scrollbar-hidden pt-3 pb-28">
        {/* Direct Messages */}
        <div className="mb-2">
          <SectionTitle text="Direct Messages" action={<NewDM />} />
          <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
            <ContactList contacts={directMessagesContacts} />
          </div>
        </div>

        {/* Channels */}
        <div className="mt-4">
          <SectionTitle text="Channels" action={<CreateChannel />} />
          <div className="max-h-[30vh] overflow-y-auto scrollbar-hidden pb-4">
            <ContactList contacts={channels} isChannel />
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 px-4 flex flex-col gap-2">
          <button
            id="feedback-btn"
            onClick={() => navigate("/feedback")}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "var(--aura-muted)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(124,58,237,0.12)";
              e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)";
              e.currentTarget.style.color = "#a78bfa";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              e.currentTarget.style.color = "var(--aura-muted)";
            }}
          >
            <MessageSquare size={14} />
            Leave Feedback
          </button>

          {userInfo?.email === "admin1234@gmail.com" && (
            <button
              id="admin-panel-btn"
              onClick={() => navigate("/admin")}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(79,70,229,0.25))",
                border: "1px solid rgba(124,58,237,0.4)",
                color: "#a78bfa",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(124,58,237,0.4), rgba(79,70,229,0.4))";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(79,70,229,0.25))";
              }}
            >
              <Shield size={14} />
              Admin Panel
            </button>
          )}
        </div>
      </div>

      {/* Fixed profile bar at bottom */}
      <ProfileInfo />
    </div>
  );
};

export default ContactsContainer;

const SectionTitle = ({ text, action }) => {
  return (
    <div className="flex items-center justify-between px-4 mb-1">
      <h6
        className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: "var(--aura-muted)", letterSpacing: "0.1em" }}
      >
        {text}
      </h6>
      {action}
    </div>
  );
};
