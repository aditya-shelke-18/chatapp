import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Paperclip } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [filePreview, setFilePreview] = useState(null); // { name, type, data }
  const fileInputRef = useRef(null);
  const anyFileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setFilePreview({ name: file.name, type: file.type, data: reader.result });
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = () => {
    setFilePreview(null);
    if (anyFileInputRef.current) anyFileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview && !filePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
        file: filePreview?.data,
        fileName: filePreview?.name,
        fileType: filePreview?.type,
      });
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
    <div className="w-full p-4">
      {imagePreview && (
        <div className="flex items-center gap-2 mb-3">
          <div className="relative">
            <img src={imagePreview} alt="Preview" className="object-cover w-20 h-20 border rounded-lg border-zinc-700" />
            <button onClick={removeImage} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center" type="button">
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      {filePreview && (
        <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-base-200">
          <Paperclip className="size-4 text-zinc-400" />
          <span className="text-sm truncate max-w-xs">{filePreview.name}</span>
          <button onClick={removeFile} className="ml-auto" type="button">
            <X className="size-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex flex-1 gap-2">
          <input
            type="text"
            className="w-full rounded-lg input input-bordered input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
          <input type="file" accept="*" className="hidden" ref={anyFileInputRef} onChange={handleFileChange} />

          <button type="button" className={`hidden sm:flex btn btn-circle ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`} onClick={() => fileInputRef.current?.click()}>
            <Image size={20} />
          </button>
          <button type="button" className={`hidden sm:flex btn btn-circle ${filePreview ? "text-emerald-500" : "text-zinc-400"}`} onClick={() => anyFileInputRef.current?.click()}>
            <Paperclip size={20} />
          </button>
        </div>
        <button type="submit" className="btn btn-sm btn-circle" disabled={!text.trim() && !imagePreview && !filePreview}>
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;