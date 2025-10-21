import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api`;
axios.defaults.withCredentials = true;

export const useContact = create((set, get) => ({
  contacts: [],
  allUsers: [],
  contactRequests: [],
  sentRequests: [],
  isLoading: false,

  // Fetch all users (potential contacts)
  fetchAllUsers: async () => {
    set({ isLoading: true });
    try {
      const res = await axios.get("/contacts/users");
      set({ allUsers: res.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching users:", error);
      set({ isLoading: false });
      toast.error("Failed to fetch users");
    }
  },

  // Fetch contacts
  fetchContacts: async () => {
    set({ isLoading: true });
    try {
      const res = await axios.get("/contacts");
      set({ contacts: res.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching contacts:", error);
      set({ isLoading: false });
      toast.error("Failed to fetch contacts");
    }
  },

  // Fetch contact requests (received)
  fetchContactRequests: async () => {
    try {
      const res = await axios.get("/contacts/requests");
      set({ contactRequests: res.data });
    } catch (error) {
      console.error("Error fetching contact requests:", error);
      toast.error("Failed to fetch contact requests");
    }
  },

  // Fetch sent requests
  fetchSentRequests: async () => {
    try {
      const res = await axios.get("/contacts/requests/sent");
      set({ sentRequests: res.data });
    } catch (error) {
      console.error("Error fetching sent requests:", error);
    }
  },

  // Send contact request
  sendContactRequest: async (receiverId) => {
    try {
      await axios.post("/contacts/request", { receiverId });
      toast.success("Contact request sent!");
      // Refresh sent requests
      get().fetchSentRequests();
    } catch (error) {
      console.error("Error sending contact request:", error);
      toast.error(error.response?.data?.message || "Failed to send request");
    }
  },

  // Accept contact request
  acceptContactRequest: async (requestId) => {
    try {
      await axios.put(`/contacts/accept/${requestId}`);
      toast.success("Contact request accepted!");
      // Refresh contacts and requests
      get().fetchContacts();
      get().fetchContactRequests();
    } catch (error) {
      console.error("Error accepting contact request:", error);
      toast.error("Failed to accept request");
    }
  },

  // Reject contact request
  rejectContactRequest: async (requestId) => {
    try {
      await axios.put(`/contacts/reject/${requestId}`);
      toast.success("Contact request rejected");
      // Refresh requests
      get().fetchContactRequests();
    } catch (error) {
      console.error("Error rejecting contact request:", error);
      toast.error("Failed to reject request");
    }
  },

  // Remove contact
  removeContact: async (contactId) => {
    try {
      await axios.delete(`/contacts/${contactId}`);
      toast.success("Contact removed");
      // Refresh contacts
      get().fetchContacts();
    } catch (error) {
      console.error("Error removing contact:", error);
      toast.error("Failed to remove contact");
    }
  },
}));
