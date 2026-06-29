import { X, Phone, Video } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-base-300/50 bg-base-100/60 backdrop-blur-sm shrink-0">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={selectedUser.profilePic || "/avatar.png"}
            alt={selectedUser.fullName}
            className="size-10 rounded-full object-cover ring-2 ring-primary/20"
          />
          {isOnline && <span className="online-dot" />}
        </div>
        <div>
          <h3 className="font-semibold text-sm leading-tight">{selectedUser.fullName}</h3>
          <p className={`text-xs ${isOnline ? "text-success" : "text-base-content/40"}`}>
            {isOnline ? "Active now" : "Offline"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button className="btn btn-ghost btn-sm btn-circle text-base-content/50 hover:text-primary">
          <Phone className="size-4" />
        </button>
        <button className="btn btn-ghost btn-sm btn-circle text-base-content/50 hover:text-primary">
          <Video className="size-4" />
        </button>
        <button
          onClick={() => setSelectedUser(null)}
          className="btn btn-ghost btn-sm btn-circle text-base-content/50 hover:text-error"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
