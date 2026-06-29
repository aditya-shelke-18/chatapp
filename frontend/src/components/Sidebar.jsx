import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Search, Users } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [search, setSearch] = useState("");
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => { getUsers(); }, [getUsers]);

  const filteredUsers = users
    .filter(u => showOnlineOnly ? onlineUsers.includes(u._id) : true)
    .filter(u => u.fullName.toLowerCase().includes(search.toLowerCase()));

  if (isUsersLoading) return <SidebarSkeleton />;

  const onlineCount = onlineUsers.filter(id => id !== useAuthStore.getState().authUser?._id).length;

  return (
    <aside className="flex flex-col w-20 lg:w-80 h-full border-r border-base-300/50 shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-base-300/50">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10">
            <Users className="size-4 text-primary" />
          </div>
          <span className="hidden lg:block font-semibold text-base">Messages</span>
          {onlineCount > 0 && (
            <span className="hidden lg:flex ml-auto items-center gap-1 text-xs text-success font-medium">
              <span className="size-1.5 rounded-full bg-success inline-block" />
              {onlineCount} online
            </span>
          )}
        </div>

        {/* Search */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-base-200/60 border border-base-300/40">
          <Search className="size-3.5 text-base-content/40 shrink-0" />
          <input
            type="text"
            placeholder="Search contacts..."
            className="bg-transparent text-sm outline-none w-full placeholder:text-base-content/30"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Online filter */}
        <label className="hidden lg:flex items-center gap-2 mt-2 cursor-pointer w-fit">
          <input
            type="checkbox"
            checked={showOnlineOnly}
            onChange={e => setShowOnlineOnly(e.target.checked)}
            className="checkbox checkbox-xs checkbox-primary"
          />
          <span className="text-xs text-base-content/50">Online only</span>
        </label>
      </div>

      {/* Contact list */}
      <div className="flex-1 overflow-y-auto py-2 px-2">
        {filteredUsers.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 gap-2 text-base-content/30">
            <Users className="size-6" />
            <span className="text-xs hidden lg:block">No contacts found</span>
          </div>
        )}

        {filteredUsers.map(user => {
          const isOnline = onlineUsers.includes(user._id);
          const isSelected = selectedUser?._id === user._id;
          const hasUnread = user.unreadCount > 0 && !isSelected;

          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`contact-item w-full ${isSelected ? "active" : ""}`}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className="size-11 rounded-full object-cover ring-2 ring-base-300/50"
                />
                {isOnline && <span className="online-dot" />}
                {hasUnread && (
                  <span className="absolute -top-1 -right-1 size-4 rounded-full bg-error text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-base-100">
                    {user.unreadCount > 9 ? "9+" : user.unreadCount}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="hidden lg:flex flex-col min-w-0 flex-1 text-left">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium truncate ${hasUnread ? "text-base-content" : "text-base-content/80"}`}>
                    {user.fullName}
                  </span>
                </div>
                <span className={`text-xs truncate ${isOnline ? "text-success" : "text-base-content/40"}`}>
                  {isOnline ? "Active now" : "Offline"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
export default Sidebar;
