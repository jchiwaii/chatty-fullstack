import { create } from "zustand";
import axios from "axios";

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
}));
