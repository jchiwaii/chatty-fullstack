import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useChat = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isLoadingMessages: false,
  isUsersLoading: false,
  typingUsers: new Set(),
  unreadMessages: {},

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

      // Clear unread messages for this user
      const { unreadMessages } = get();
      const newUnreadMessages = { ...unreadMessages };
      delete newUnreadMessages[userId];
      set({ unreadMessages: newUnreadMessages });
    } catch (error) {
      console.error("Error fetching messages:", error);
      set({ isLoadingMessages: false });
      toast.error("Failed to load messages");
    }
  },

  setSelectedUser: (user) => {
    const { getMessages } = get();
    set({ selectedUser: user });
    if (user) {
      // Only clear messages after starting to load new ones
      set({ messages: [], isLoadingMessages: true });
      getMessages(user._id);
    } else {
      set({ messages: [] });
    }
    // Clear typing indicators when switching users
    set({ typingUsers: new Set() });
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) return;

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );

      // Add message to local state immediately for better UX
      set({ messages: [...messages, res.data] });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  },

  // Real-time message handling
  addMessage: (message) => {
    const { messages, selectedUser, unreadMessages } = get();

    // If the message is for the currently selected user, add it to messages
    if (
      selectedUser &&
      (message.sender === selectedUser._id ||
        message.receiver === selectedUser._id)
    ) {
      set({ messages: [...messages, message] });
    } else {
      // Otherwise, increment unread count
      const senderId = message.sender;
      const newUnreadMessages = { ...unreadMessages };
      newUnreadMessages[senderId] = (newUnreadMessages[senderId] || 0) + 1;
      set({ unreadMessages: newUnreadMessages });
    }
  },

  // Typing indicators
  setUserTyping: (userId, isTyping) => {
    const { typingUsers } = get();
    const newTypingUsers = new Set(typingUsers);

    if (isTyping) {
      newTypingUsers.add(userId);
    } else {
      newTypingUsers.delete(userId);
    }

    set({ typingUsers: newTypingUsers });
  },

  // Get unread count for a user
  getUnreadCount: (userId) => {
    const { unreadMessages } = get();
    return unreadMessages[userId] || 0;
  },

  // Clear all unread messages
  clearAllUnread: () => {
    set({ unreadMessages: {} });
  },
}));
