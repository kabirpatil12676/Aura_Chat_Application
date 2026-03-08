import { useAppStore } from "@/store";
import apiClient from "@/lib/api-client";
import { HOST, LOGOUT_ROUTE } from "@/lib/constants";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { FiEdit2 } from "react-icons/fi";
import { IoPowerSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { getColor } from "@/lib/utils";

const ProfileInfo = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const response = await apiClient.post(LOGOUT_ROUTE, {}, { withCredentials: true });
      if (response.status === 200) {
        navigate("/auth");
        setUserInfo(undefined);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 glass-dark"
      style={{ borderTop: "1px solid rgba(124,58,237,0.15)" }}
    >
      {/* Avatar + Name */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative flex-shrink-0">
          <Avatar className="w-10 h-10 rounded-full block">
            {userInfo.image ? (
              <AvatarImage
                src={`${HOST}/${userInfo.image}`}
                alt="profile"
                className="object-cover w-10 h-10 rounded-full"
              />
            ) : (
              <div
                className={`uppercase w-10 h-10 text-sm font-semibold ${getColor(userInfo.color)} flex items-center justify-center rounded-full`}
              >
                {userInfo.firstName
                  ? userInfo.firstName.split("").shift()
                  : userInfo.email.split("").shift()}
              </div>
            )}
          </Avatar>
          {/* Online dot */}
          <span
            className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2"
            style={{
              background: "#22c55e",
              borderColor: "var(--aura-surface)",
            }}
          />
        </div>

        <div className="min-w-0">
          <p
            className="text-sm font-semibold truncate"
            style={{ color: "var(--aura-text)" }}
          >
            {userInfo.firstName && userInfo.lastName
              ? `${userInfo.firstName} ${userInfo.lastName}`
              : userInfo.email}
          </p>
          <p className="text-xs" style={{ color: "var(--aura-muted)" }}>Online</p>
        </div>
      </div>

      {/* Action icons */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                id="edit-profile-btn"
                onClick={() => navigate("/profile")}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                style={{ color: "#a78bfa" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(124,58,237,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <FiEdit2 size={15} />
              </button>
            </TooltipTrigger>
            <TooltipContent className="glass-dark border-none mb-2 p-2 rounded-lg">
              <p className="text-xs" style={{ color: "var(--aura-text)" }}>Edit Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                id="logout-btn"
                onClick={logout}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                style={{ color: "#f87171" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(239,68,68,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <IoPowerSharp size={15} />
              </button>
            </TooltipTrigger>
            <TooltipContent className="glass-dark border-none mb-2 p-2 rounded-lg">
              <p className="text-xs" style={{ color: "var(--aura-text)" }}>Logout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;
