import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const MessageReactions = ({ message, isMine }) => {
  const { addReaction } = useChatStore();
  const { authUser } = useAuthStore();
  const emojis = ['👍', '❤️', '😂', '😮', '😢', '😡'];

  const getCount = (emoji) => message.reactions?.filter(r => r.emoji === emoji).length || 0;
  const hasReacted = (emoji) => message.reactions?.some(r => r.emoji === emoji && r.userId === authUser._id);
  const active = emojis.filter(e => getCount(e) > 0);

  if (active.length === 0 && true) {
    return (
      <div className="dropdown dropdown-top mt-0.5">
        <button tabIndex={0} className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] px-2 py-0.5 rounded-full border border-base-300/50 bg-base-100/80 text-base-content/40 hover:text-base-content/70">
          +
        </button>
        <div tabIndex={0} className="dropdown-content menu p-1.5 shadow-lg bg-base-100 border border-base-300/50 rounded-2xl">
          <div className="flex gap-0.5">
            {emojis.map(e => (
              <button key={e} onClick={() => addReaction(message._id, e)}
                className="text-base hover:scale-125 transition-transform p-1 rounded-lg hover:bg-base-200">
                {e}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {active.map(emoji => {
        const count = getCount(emoji);
        const reacted = hasReacted(emoji);
        return (
          <button key={emoji} onClick={() => addReaction(message._id, emoji)}
            title={reacted ? "Click to remove" : "Click to react"}
            className={`flex items-center gap-0.5 text-xs px-2 py-0.5 rounded-full border transition-all ${
              reacted ? "bg-primary/15 border-primary/30 text-primary" : "bg-base-100/80 border-base-300/50 text-base-content/60 hover:bg-base-200"
            }`}>
            {emoji} <span className="text-[10px] font-medium">{count}</span>
          </button>
        );
      })}
      <div className="dropdown dropdown-top">
        <button tabIndex={0} className="text-xs px-2 py-0.5 rounded-full border border-base-300/50 bg-base-100/80 text-base-content/40 hover:text-base-content/70">+</button>
        <div tabIndex={0} className="dropdown-content menu p-1.5 shadow-lg bg-base-100 border border-base-300/50 rounded-2xl">
          <div className="flex gap-0.5">
            {emojis.map(e => (
              <button key={e} onClick={() => addReaction(message._id, e)}
                className="text-base hover:scale-125 transition-transform p-1 rounded-lg hover:bg-base-200">
                {e}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default MessageReactions;
