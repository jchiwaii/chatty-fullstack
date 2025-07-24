import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = "http://localhost:3000/api";
axios.defaults.withCredentials = true;

export const useAuth = create((set) => ({
  authUser: null,
  isSigningup: false,
  isLoggingin: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axios.get("/auth/check");
      set({ authUser: res.data, isCheckingAuth: false });
    } catch (error) {
      console.error("Error checking auth:", error);
      set({ authUser: null, isCheckingAuth: false });
    }
  },
  signup: async (formData) => {
    set({ isSigningup: true });
    try {
      const res = await axios.post("/auth/signup", formData);
      set({ authUser: res.data, isSigningup: false });
      toast.success("Account created successfully!"); // Handle success here
    } catch (error) {
      console.error("Error signing up:", error);
      set({ isSigningup: false });
      toast.error(error.response?.data?.message || "Signup failed"); // Handle error here
      throw error; // Re-throw so the component knows it failed
    }
  },
  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Logout failed");
    }
  },
  login: async (formData) => {
    set({ isLoggingin: true });
    try {
      const res = await axios.post("/auth/login", formData);
      set({ authUser: res.data, isLoggingin: false });
      toast.success("Logged in successfully!"); // Handle success here
    } catch (error) {
      console.error("Error logging in:", error);
      set({ isLoggingin: false });
      toast.error(error.response?.data?.message || "Login failed"); // Handle error here
      throw error; // Re-throw so the component knows it failed
    }
  },
}));
