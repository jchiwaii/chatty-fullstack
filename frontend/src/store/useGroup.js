import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api`;
axios.defaults.withCredentials = true;

export const useGroup = create((set, get) => ({
  groups: [],
  selectedGroup: null,
  groupMessages: [],
  isLoading: false,

  // Fetch user's groups
  fetchGroups: async () => {
    set({ isLoading: true });
    try {
      const res = await axios.get("/groups");
      set({ groups: res.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching groups:", error);
      set({ isLoading: false });
      toast.error("Failed to fetch groups");
    }
  },

  // Create group
  createGroup: async (groupData) => {
    try {
      const res = await axios.post("/groups", groupData);
      toast.success("Group created!");
      // Refresh groups
      get().fetchGroups();
      return res.data;
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error(error.response?.data?.message || "Failed to create group");
      throw error;
    }
  },

  // Get group details
  fetchGroupDetails: async (groupId) => {
    set({ isLoading: true });
    try {
      const res = await axios.get(`/groups/${groupId}`);
      set({ selectedGroup: res.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching group details:", error);
      set({ isLoading: false });
      toast.error("Failed to fetch group details");
    }
  },

  // Update group
  updateGroup: async (groupId, updateData) => {
    try {
      await axios.put(`/groups/${groupId}`, updateData);
      toast.success("Group updated!");
      get().fetchGroupDetails(groupId);
      get().fetchGroups();
    } catch (error) {
      console.error("Error updating group:", error);
      toast.error("Failed to update group");
    }
  },

  // Delete group
  deleteGroup: async (groupId) => {
    try {
      await axios.delete(`/groups/${groupId}`);
      toast.success("Group deleted");
      set({ selectedGroup: null });
      get().fetchGroups();
    } catch (error) {
      console.error("Error deleting group:", error);
      toast.error("Failed to delete group");
    }
  },

  // Add members
  addMembers: async (groupId, memberIds) => {
    try {
      await axios.post(`/groups/${groupId}/members`, { memberIds });
      toast.success("Members added!");
      get().fetchGroupDetails(groupId);
    } catch (error) {
      console.error("Error adding members:", error);
      toast.error(error.response?.data?.message || "Failed to add members");
    }
  },

  // Remove member
  removeMember: async (groupId, memberId) => {
    try {
      await axios.delete(`/groups/${groupId}/members/${memberId}`);
      toast.success("Member removed");
      get().fetchGroupDetails(groupId);
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member");
    }
  },

  // Leave group
  leaveGroup: async (groupId) => {
    try {
      await axios.post(`/groups/${groupId}/leave`);
      toast.success("Left group");
      set({ selectedGroup: null });
      get().fetchGroups();
    } catch (error) {
      console.error("Error leaving group:", error);
      toast.error("Failed to leave group");
    }
  },

  // Fetch group messages
  fetchGroupMessages: async (groupId) => {
    try {
      const res = await axios.get(`/groups/${groupId}/messages`);
      set({ groupMessages: res.data });
    } catch (error) {
      console.error("Error fetching group messages:", error);
      toast.error("Failed to fetch messages");
    }
  },

  // Send group message
  sendGroupMessage: async (groupId, messageData) => {
    try {
      const res = await axios.post(`/groups/${groupId}/messages`, messageData);
      // Add message to local state
      set((state) => ({
        groupMessages: [...state.groupMessages, res.data],
      }));
      return res.data;
    } catch (error) {
      console.error("Error sending group message:", error);
      toast.error("Failed to send message");
      throw error;
    }
  },

  // Set selected group
  setSelectedGroup: (group) => {
    set({ selectedGroup: group });
    if (group) {
      get().fetchGroupMessages(group._id);
    }
  },

  // Clear selected group
  clearSelectedGroup: () => {
    set({ selectedGroup: null, groupMessages: [] });
  },
}));
