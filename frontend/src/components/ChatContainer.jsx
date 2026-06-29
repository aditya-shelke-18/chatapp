import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import MessageReactions from "./MessageReactions";
import SmartReply from "./SmartReply";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { Paperclip, Trash2 } from "lucide-react";

const ChatContainer = () => {
  const {
    messages, getMessages, isMessagesLoading,
    selectedUser, subscribeToMessages, unsubscribeFromMessages, deleteMessage,
  } = useChatStore();
  const { authUser, socket } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => { if (socket) subscribeToMessages(); }, [socket]);

  useEffect(() => {
    if (messageEndRef.current && messages)
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex flex-col flex-1 overflow-hidden">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-gradient-to-b from-base-100/30 to-base-200/20">
      <ChatHeader />

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex justify-center items-center h-full">
            <p className="text-base-content/30 text-sm">No messages yet. Say hello! 👋</p>
          </div>
        )}

        {messages.map((message, idx) => {
          const isMine = message.senderId === authUser._id;
          const showAvatar = !isMine && (idx === 0 || messages[idx - 1]?.senderId !== message.senderId);

          return (
            <div
              key={message._id}
              className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}
              ref={idx === messages.length - 1 ? messageEndRef : null}
            >
              {/* Avatar — only for received, only when sender changes */}
              {!isMine && (
                <div className="size-7 shrink-0">
                  {showAvatar && (
                    <img
                      src={selectedUser.profilePic || "/avatar.png"}
                      className="size-7 rounded-full object-cover ring-1 ring-base-300"
                    />
                  )}
                </div>
              )}

              {/* Bubble */}
              <div className={`group relative max-w-[70%] flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="max-w-[220px] rounded-2xl mb-1 shadow-md"
                  />
                )}
                {message.file && (
                  <a
                    href={message.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 mb-1 rounded-2xl bg-base-200 border border-base-300/50 hover:bg-base-300 transition-colors"
                  >
                    <Paperclip className="size-4 text-primary shrink-0" />
                    <span className="text-sm truncate max-w-[160px]">{message.fileName || "File"}</span>
                  </a>
                )}
                {message.text && (
                  <div className={`px-4 py-2.5 text-sm leading-relaxed ${isMine ? "bubble-sent" : "bubble-received"}`}>
                    {message.text}
                  </div>
                )}

                <div className={`flex items-center gap-1 mt-0.5 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                  <time className="text-[10px] text-base-content/30 px-1">
                    {formatMessageTime(message.createdAt)}
                  </time>
                </div>

                <MessageReactions message={message} isMine={isMine} />

                {/* Delete button */}
                {isMine && (
                  <button
                    onClick={() => deleteMessage(message._id)}
                    className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity size-5 rounded-full bg-base-300 hover:bg-error hover:text-white flex items-center justify-center shadow"
                    title="Delete"
                  >
                    <Trash2 className="size-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <SmartReply />
      <MessageInput />
    </div>
  );
};
export default ChatContainer;
