import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Plus, Search, UserPlus } from "lucide-react";
import { useState } from "react";
import { useAppStore } from "@/store";
import { HOST, SEARCH_CONTACTS_ROUTES } from "@/lib/constants";
import apiClient from "@/lib/api-client";
import { animationDefaultOptions, getColor } from "@/lib/utils";
import Lottie from "react-lottie";
import { ScrollArea } from "@/components/ui/scroll-area";

const NewDM = () => {
  const [searchedContacts, setsearchedContacts] = useState([]);
  const [openNewContactModal, setOpenNewContactModal] = useState(false);
  const { setSelectedChatType, setSelectedChatData } = useAppStore();

  const searchContacts = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        const response = await apiClient.post(
          SEARCH_CONTACTS_ROUTES,
          { searchTerm },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data.contacts) {
          setsearchedContacts(response.data.contacts);
        }
      } else setsearchedContacts([]);
    } catch (error) {
      console.log(error);
    }
  };

  const selectNewContact = (contact) => {
    setOpenNewContactModal(false);
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    setsearchedContacts([]);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              id="new-dm-btn"
              onClick={() => setOpenNewContactModal(true)}
              className="w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200"
              style={{ color: "var(--aura-muted)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(124,58,237,0.2)";
                e.currentTarget.style.color = "#a78bfa";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--aura-muted)";
              }}
            >
              <Plus size={14} />
            </button>
          </TooltipTrigger>
          <TooltipContent className="glass-dark border-none mb-2 p-2 rounded-lg">
            <p className="text-xs" style={{ color: "var(--aura-text)" }}>New Message</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
        <DialogContent
          className="border-none text-white flex flex-col p-0 overflow-hidden"
          style={{
            background: "var(--aura-surface)",
            border: "1px solid rgba(124,58,237,0.25)",
            borderRadius: "1.25rem",
            width: "420px",
            maxHeight: "520px",
          }}
        >
          {/* Gradient top accent */}
          <div style={{ height: "3px", background: "linear-gradient(90deg, #7c3aed, #4f46e5, #a78bfa)", flexShrink: 0 }} />

          <DialogDescription className="hidden">Please select a contact</DialogDescription>

          <div className="p-6 flex flex-col gap-5 flex-1 min-h-0">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
                >
                  <UserPlus size={16} />
                </div>
                <div>
                  <DialogTitle className="text-base font-semibold" style={{ color: "var(--aura-text)" }}>
                    New Message
                  </DialogTitle>
                  <p className="text-xs mt-0.5" style={{ color: "var(--aura-muted)" }}>
                    Search and start a conversation
                  </p>
                </div>
              </div>
            </DialogHeader>

            {/* Search input */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--aura-muted)" }} />
              <Input
                id="search-contacts-input"
                placeholder="Search by name or email…"
                className="aura-input h-10 pl-9 text-sm"
                onChange={(e) => searchContacts(e.target.value)}
              />
            </div>

            {/* Results list */}
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-1 pr-1">
                {searchedContacts.map((contact) => (
                  <div
                    key={contact._id || contact.id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150"
                    style={{ border: "1px solid transparent" }}
                    onClick={() => selectNewContact(contact)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(124,58,237,0.12)";
                      e.currentTarget.style.borderColor = "rgba(124,58,237,0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = "transparent";
                    }}
                  >
                    <Avatar className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      {contact.image ? (
                        <AvatarImage
                          src={`${HOST}/${contact.image}`}
                          alt="profile"
                          className="object-cover w-full h-full rounded-full"
                        />
                      ) : (
                        <div
                          className={`uppercase w-10 h-10 text-sm font-semibold ${getColor(contact.color)} flex items-center justify-center rounded-full`}
                        >
                          {contact.firstName
                            ? contact.firstName.split("").shift()
                            : contact.email.split("").shift()}
                        </div>
                      )}
                    </Avatar>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium truncate" style={{ color: "var(--aura-text)" }}>
                        {contact.firstName && contact.lastName
                          ? `${contact.firstName} ${contact.lastName}`
                          : contact.email}
                      </span>
                      <span className="text-xs truncate" style={{ color: "var(--aura-muted)" }}>
                        {contact.email}
                      </span>
                    </div>
                  </div>
                ))}

                {searchedContacts.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 gap-3">
                    <Lottie
                      isClickToPauseDisabled={true}
                      options={animationDefaultOptions}
                      height={80}
                      width={80}
                    />
                    <p className="text-sm text-center" style={{ color: "var(--aura-muted)" }}>
                      Type a name or email to search contacts
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDM;
