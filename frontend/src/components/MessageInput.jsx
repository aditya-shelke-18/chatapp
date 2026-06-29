import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Paperclip } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);
  const anyFileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error("File size must be under 10MB"); return; }
    const reader = new FileReader();
    reader.onloadend = () => setFilePreview({ name: file.name, type: file.type, data: reader.result });
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview && !filePreview) return;
    try {
      await sendMessage({ text: text.trim(), image: imagePreview, file: filePreview?.data, fileName: filePreview?.name, fileType: filePreview?.type });
      setText("");
      setImagePreview(null);
      setFilePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (anyFileInputRef.current) anyFileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="input-area px-4 py-3">
      {/* Previews */}
      {imagePreview && (
        <div className="mb-2 relative w-fit">
          <img src={imagePreview} className="h-20 rounded-xl object-cover border border-base-300/50 shadow" />
          <button onClick={() => { setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
            className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-error text-white flex items-center justify-center shadow">
            <X className="size-3" />
          </button>
        </div>
      )}
      {filePreview && (
        <div className="mb-2 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-base-200/70 border border-base-300/40 w-fit max-w-xs">
          <Paperclip className="size-3.5 text-primary shrink-0" />
          <span className="text-xs truncate">{filePreview.name}</span>
          <button onClick={() => { setFilePreview(null); if (anyFileInputRef.current) anyFileInputRef.current.value = ""; }}>
            <X className="size-3 text-base-content/40 hover:text-error" />
          </button>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        {/* Hidden file inputs */}
        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
        <input type="file" accept="*" className="hidden" ref={anyFileInputRef} onChange={handleFileChange} />

        {/* Action buttons */}
        <button type="button" onClick={() => fileInputRef.current?.click()}
          className={`btn btn-ghost btn-sm btn-circle ${imagePreview ? "text-primary" : "text-base-content/40"}`}>
          <Image size={18} />
        </button>
        <button type="button" onClick={() => anyFileInputRef.current?.click()}
          className={`btn btn-ghost btn-sm btn-circle ${filePreview ? "text-primary" : "text-base-content/40"}`}>
          <Paperclip size={18} />
        </button>

        {/* Text input */}
        <div className="flex-1 flex items-center px-4 py-2 rounded-2xl bg-base-200/60 border border-base-300/40 focus-within:border-primary/40 focus-within:bg-base-200/80 transition-all">
          <input
            type="text"
            className="bg-transparent outline-none w-full text-sm placeholder:text-base-content/30"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {/* Send */}
        <button
          type="submit"
          disabled={!text.trim() && !imagePreview && !filePreview}
          className="btn btn-primary btn-sm btn-circle shadow-md disabled:opacity-30"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
