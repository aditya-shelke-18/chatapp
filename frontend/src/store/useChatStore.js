import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { showNotification } from "../lib/notification";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  smartReplies: [],
  isGeneratingReplies: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true, smartReplies: [], isGeneratingReplies: false });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
      await axiosInstance.put(`/messages/seen/${userId}`);
      set(state => ({
        users: state.users.map(u => u._id === userId ? { ...u, unreadCount: 0 } : u)
      }));
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data], smartReplies: [], isGeneratingReplies: false });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");
    socket.off("messageReaction");
    socket.off("messageDeleted");
    socket.off("translatedMessage");
    socket.off("smartReplies");

    socket.on("newMessage", (newMessage) => {
      const { selectedUser } = get();
      const isFromSelectedUser = newMessage.senderId === selectedUser?._id;
      if (isFromSelectedUser) {
        set({ messages: [...get().messages, newMessage], isGeneratingReplies: true });
        axiosInstance.put(`/messages/seen/${newMessage.senderId}`);
      } else {
        // find sender name from users list
        const sender = get().users.find(u => u._id === newMessage.senderId);
        const senderName = sender?.fullName || "Someone";
        const body = newMessage.text || (newMessage.image ? "Sent an image" : "Sent a file");
        showNotification(senderName, body, sender?.profilePic || "/avatar.png");
        set(state => ({
          users: state.users.map(u =>
            u._id === newMessage.senderId
              ? { ...u, unreadCount: (u.unreadCount || 0) + 1 }
              : u
          )
        }));
      }
    });

    socket.on("messageReaction", ({ messageId, reactions }) => {
      set({ messages: get().messages.map(msg =>
        msg._id === messageId ? { ...msg, reactions } : msg
      )});
    });

    socket.on("messageDeleted", (messageId) => {
      set({ messages: get().messages.filter(msg => msg._id !== messageId) });
    });

    socket.on("translatedMessage", ({ messageId, translatedText, language }) => {
      set({
        messages: get().messages.map(msg =>
          msg._id.toString() === messageId
            ? { ...msg, translatedText, translatedLanguage: language }
            : msg
        )
      });
    });

    socket.on("smartReplies", ({ messageId, replies }) => {
      const { messages } = get();
      const lastMsg = messages[messages.length - 1];
      // only show if this is still the latest message in the active chat
      if (lastMsg && lastMsg._id.toString() === messageId.toString()) {
        set({ smartReplies: replies, isGeneratingReplies: false });
      } else {
        set({ isGeneratingReplies: false });
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("messageReaction");
    socket.off("messageDeleted");
    socket.off("translatedMessage");
    socket.off("smartReplies");
  },

  addReaction: async (messageId, emoji) => {
    try {
      await axiosInstance.post(`/messages/react/${messageId}`, { emoji });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  deleteMessage: async (messageId) => {
    try {
      await axiosInstance.delete(`/messages/${messageId}`);
      set({ messages: get().messages.filter(msg => msg._id !== messageId) });
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));