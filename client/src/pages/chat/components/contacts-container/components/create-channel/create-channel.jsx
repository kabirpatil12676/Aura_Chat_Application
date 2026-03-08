import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Hash } from "lucide-react";
import MultipleSelector from "@/components/ui/multipleselect";
import { useEffect, useState } from "react";
import apiClient from "@/lib/api-client";
import { CREATE_CHANNEL, GET_ALL_CONTACTS } from "@/lib/constants";
import { useSocket } from "@/contexts/SocketContext";
import { useAppStore } from "@/store";
import { Input } from "@/components/ui/input";

const CreateChannel = () => {
  const [newChannelModal, setNewChannelModal] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [channelName, setChannelName] = useState("");
  const socket = useSocket();
  const { addChannel } = useAppStore();

  useEffect(() => {
    const getData = async () => {
      const response = await apiClient.get(GET_ALL_CONTACTS, { withCredentials: true });
      setAllContacts(response.data.contacts);
    };
    getData();
  }, []);

  const createChannel = async () => {
    const response = await apiClient.post(
      CREATE_CHANNEL,
      { name: channelName, members: selectedContacts.map((c) => c.value) },
      { withCredentials: true }
    );
    if (response.status === 201) {
      setChannelName("");
      setSelectedContacts([]);
      setNewChannelModal(false);
      addChannel(response.data.channel);
      socket.emit("add-channel-notify", response.data.channel);
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              id="create-channel-btn"
              onClick={() => setNewChannelModal(true)}
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
            <p className="text-xs" style={{ color: "var(--aura-text)" }}>Create Channel</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
        <DialogDescription className="hidden">Please insert details</DialogDescription>
        <DialogContent
          className="border-none text-white flex flex-col p-0 overflow-hidden"
          style={{
            background: "var(--aura-surface)",
            border: "1px solid rgba(124,58,237,0.25)",
            borderRadius: "1.25rem",
            width: "420px",
          }}
        >
          {/* Gradient top accent */}
          <div style={{ height: "3px", background: "linear-gradient(90deg, #7c3aed, #4f46e5, #a78bfa)" }} />

          <div className="p-6 flex flex-col gap-5">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
                >
                  <Hash size={16} />
                </div>
                <div>
                  <DialogTitle className="text-base font-semibold" style={{ color: "var(--aura-text)" }}>
                    Create Channel
                  </DialogTitle>
                  <p className="text-xs mt-0.5" style={{ color: "var(--aura-muted)" }}>
                    Group conversations for your team
                  </p>
                </div>
              </div>
            </DialogHeader>

            {/* Channel name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--aura-muted)" }}>
                Channel Name
              </label>
              <Input
                id="channel-name-input"
                placeholder="e.g. design-team"
                className="aura-input h-11"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
              />
            </div>

            {/* Member selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--aura-muted)" }}>
                Add Members
              </label>
              <MultipleSelector
                className="rounded-xl border text-white text-sm"
                style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)" }}
                defaultOptions={allContacts}
                placeholder="Search and select contacts…"
                value={selectedContacts}
                onChange={setSelectedContacts}
                emptyIndicator={
                  <p className="text-center text-sm py-2" style={{ color: "var(--aura-muted)" }}>
                    No contacts found.
                  </p>
                }
              />
            </div>

            {/* Create button */}
            <button
              id="create-channel-submit-btn"
              onClick={createChannel}
              disabled={!channelName.trim() || selectedContacts.length === 0}
              className="aura-btn h-11 w-full rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
            >
              Create Channel
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;
