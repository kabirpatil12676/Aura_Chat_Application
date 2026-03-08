import { HOST } from "@/lib/constants";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

const ContactList = ({ contacts, isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatType,
    setSelectedChatData,
    setSelectedChatMessages,
  } = useAppStore();

  const handleClick = (contact) => {
    if (isChannel) setSelectedChatType("channel");
    else setSelectedChatType("contact");
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };

  const isActive = (contact) =>
    selectedChatData && selectedChatData._id === contact._id;

  return (
    <div className="mt-1 px-2">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          onClick={() => handleClick(contact)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 mb-0.5"
          style={
            isActive(contact)
              ? {
                  background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(79,70,229,0.3))",
                  border: "1px solid rgba(124,58,237,0.35)",
                }
              : {
                  background: "transparent",
                  border: "1px solid transparent",
                }
          }
          onMouseEnter={(e) => {
            if (!isActive(contact)) {
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive(contact)) {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "transparent";
            }
          }}
        >
          {/* Avatar / Channel icon */}
          {!isChannel ? (
            <Avatar className="h-9 w-9 flex-shrink-0">
              {contact.image && (
                <AvatarImage
                  src={`${HOST}/${contact.image}`}
                  alt="profile"
                  className="rounded-full object-cover h-full w-full"
                />
              )}
              <AvatarFallback
                className={`uppercase h-9 w-9 flex items-center justify-center rounded-full text-sm font-semibold ${
                  isActive(contact)
                    ? "bg-white/20 text-white border border-white/30"
                    : getColor(contact.color)
                }`}
              >
                {contact.firstName ? contact.firstName.split("").shift() : "?"}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div
              className="h-9 w-9 flex items-center justify-center rounded-full text-sm font-bold flex-shrink-0"
              style={{
                background: isActive(contact)
                  ? "linear-gradient(135deg, #7c3aed, #4f46e5)"
                  : "rgba(124,58,237,0.18)",
                color: isActive(contact) ? "#fff" : "#a78bfa",
                border: isActive(contact)
                  ? "none"
                  : "1px solid rgba(124,58,237,0.3)",
              }}
            >
              #
            </div>
          )}

          {/* Name */}
          <span
            className="text-sm font-medium truncate"
            style={{
              color: isActive(contact) ? "#ffffff" : "var(--aura-text)",
              opacity: isActive(contact) ? 1 : 0.85,
            }}
          >
            {isChannel
              ? contact.name
              : `${contact.firstName} ${contact.lastName}`}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
