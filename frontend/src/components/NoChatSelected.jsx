import { MessageSquare, Sparkles, Shield } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-1 bg-gradient-to-br from-base-100/40 to-base-200/60 p-8">
      <div className="text-center max-w-sm space-y-6">
        <div className="flex justify-center">
          <div className="no-chat-icon">
            <MessageSquare className="size-14 text-primary" strokeWidth={1.5} />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome to Talkify
          </h2>
          <p className="text-base-content/50 text-sm leading-relaxed">
            Select a conversation from the sidebar to start chatting with your contacts.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-left">
          {[
            { icon: MessageSquare, text: "Real-time messaging" },
            { icon: Sparkles, text: "AI Smart Replies" },
            { icon: Shield, text: "Secure & private" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-base-200/50 border border-base-300/30">
              <Icon className="size-4 text-primary shrink-0" />
              <span className="text-sm text-base-content/60">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default NoChatSelected;
