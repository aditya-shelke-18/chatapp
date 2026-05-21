import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const MessageReactions = ({ message }) => {
  const { addReaction } = useChatStore();
  const { authUser } = useAuthStore();

  const emojis = ['👍', '❤️', '😂', '😮', '😢', '😡'];

  const getReactionCount = (emoji) => message.reactions?.filter(r => r.emoji === emoji).length || 0;

  const hasUserReacted = (emoji) =>
    message.reactions?.some(r => r.emoji === emoji && r.userId === authUser._id);

  const activeReactions = emojis.filter(e => getReactionCount(e) > 0);

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {activeReactions.map((emoji) => {
        const count = getReactionCount(emoji);
        const userReacted = hasUserReacted(emoji);
        return (
          <button
            key={emoji}
            onClick={() => addReaction(message._id, emoji)}
            title={userReacted ? "Click to remove" : "Click to react"}
            className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
              userReacted
                ? 'bg-blue-100 border-blue-300 text-blue-700'
                : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
            }`}
          >
            {emoji} {count}
          </button>
        );
      })}

      <div className="dropdown dropdown-top">
        <button tabIndex={0} className="text-xs px-2 py-0.5 rounded-full border bg-gray-100 hover:bg-gray-200">+</button>
        <div tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box">
          <div className="flex gap-1">
            {emojis.map((emoji) => (
              <button key={emoji} onClick={() => addReaction(message._id, emoji)} className="text-lg hover:bg-gray-100 p-1 rounded">
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageReactions;