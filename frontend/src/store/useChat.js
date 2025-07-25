import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { get } from "mongoose";

export const useChat = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isLoadingMessages: false,
  isUsersLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data, isUsersLoading: false });
    } catch (error) {
      console.error("Error fetching users:", error);
      set({ isUsersLoading: false });
      toast.error("Failed to load users");
    }
  },
  getMessages: async (userId) => {
    set({ isLoadingMessages: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data, isLoadingMessages: false });
    } catch (error) {
      console.error("Error fetching messages:", error);
      set({ isLoadingMessages: false });
      toast.error("Failed to load messages");
    }
  },

  // TODO: Optimize this function to avoid unnecessary re-renders
  setSelectedUser: (user) => set({ selectedUser: user }),

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({
        messages: [...messages, res.data],
      });
      toast.success("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  },
}));
