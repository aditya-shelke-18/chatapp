import { useChatStore } from "../store/useChatStore";
import { Sparkles, X } from "lucide-react";

const TONE_STYLES = {
  Professional: "badge-primary",
  Friendly: "badge-success",
  Short: "badge-warning",
};

const SmartReply = () => {
  const { smartReplies, sendMessage, setSmartReplies } = useChatStore();

  if (!smartReplies || smartReplies.length === 0) return null;

  const handleClick = (text) => {
    sendMessage({ text });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-2 border-t border-base-300 bg-base-100">
      <span className="flex items-center gap-1 text-xs text-zinc-400">
        <Sparkles className="size-3 text-yellow-400" /> AI Suggestions
      </span>
      {smartReplies.map((reply) => (
        <button
          key={reply.tone}
          onClick={() => handleClick(reply.text)}
          className={`badge ${TONE_STYLES[reply.tone] || "badge-neutral"} badge-outline cursor-pointer hover:opacity-80 transition-opacity text-xs py-3 px-3 h-auto`}
          title={reply.tone}
        >
          <span className="font-semibold mr-1">{reply.tone}:</span> {reply.text}
        </button>
      ))}
      <button
        onClick={() => useChatStore.setState({ smartReplies: [] })}
        className="ml-auto text-zinc-400 hover:text-zinc-600"
        title="Dismiss"
      >
        <X className="size-3" />
      </button>
    </div>
  );
};

export default SmartReply;
