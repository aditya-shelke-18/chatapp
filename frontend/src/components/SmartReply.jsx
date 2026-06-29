import { useChatStore } from "../store/useChatStore";
import { Sparkles, X } from "lucide-react";

const TONE_COLORS = {
  Professional: "border-primary/40 text-primary hover:bg-primary/10",
  Friendly:     "border-success/40 text-success hover:bg-success/10",
  Short:        "border-warning/40 text-warning hover:bg-warning/10",
};

const SmartReply = () => {
  const { smartReplies, sendMessage } = useChatStore();
  if (!smartReplies?.length) return null;

  return (
    <div className="smart-reply-bar px-4 py-2 flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1 text-[11px] text-base-content/40 shrink-0">
        <Sparkles className="size-3 text-yellow-400" />
        AI Suggestions
      </span>

      {smartReplies.map((reply) => (
        <button
          key={reply.tone}
          onClick={() => sendMessage({ text: reply.text })}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium transition-colors ${TONE_COLORS[reply.tone] || "border-base-300 text-base-content/60 hover:bg-base-200"}`}
        >
          <span className="opacity-60">{reply.tone}:</span>
          <span>{reply.text}</span>
        </button>
      ))}

      <button
        onClick={() => useChatStore.setState({ smartReplies: [] })}
        className="ml-auto btn btn-ghost btn-xs btn-circle text-base-content/30 hover:text-base-content/60"
      >
        <X className="size-3" />
      </button>
    </div>
  );
};
export default SmartReply;
