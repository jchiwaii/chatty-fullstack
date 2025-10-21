import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import { useSocket } from "./useSocket";

axios.defaults.baseURL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api`;
axios.defaults.withCredentials = true;

export const useAuth = create((set, get) => ({
  authUser: null,
  isSigningup: false,
  isLoggingin: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axios.get("/auth/check");
      set({ authUser: res.data, isCheckingAuth: false });

      // Note: WebSocket connection disabled for demo mode
      // Uncomment below when backend server is available
      /*
      if (res.data) {
        try {
          const { connectSocket } = useSocket.getState();
          connectSocket(res.data._id);
        } catch (error) {
          console.log("Socket connection failed, continuing without real-time features");
        }
      }
      */
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
      const message = error.response?.data?.message || "Signup failed";
      if (message.includes("email")) {
        toast.error("Signup failed");
      } else {
        toast.error(message);
      }
      throw error; // Re-throw so the component knows it failed
    }
  },
  logout: async () => {
    try {
      await axios.post("/auth/logout");

      // Disconnect socket before logout
      const { disconnectSocket } = useSocket.getState();
      disconnectSocket();

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

      // Connect to socket after successful login
      try {
        const { connectSocket } = useSocket.getState();
        connectSocket(res.data._id);
      } catch (error) {
        console.log(
          "Socket connection failed, continuing without real-time features"
        );
      }

      toast.success("Logged in successfully!");
    } catch (error) {
      console.error("Error logging in:", error);
      set({ isLoggingin: false });
      toast.error(error.response?.data?.message || "Login failed");
      throw error;
    }
  },
  googleSignIn: async (token) => {
    set({ isLoggingin: true });
    try {
      const res = await axios.post("/auth/google", { token });
      set({ authUser: res.data, isLoggingin: false });

      // Connect to socket after successful Google login
      try {
        const { connectSocket } = useSocket.getState();
        connectSocket(res.data._id);
      } catch (error) {
        console.log(
          "Socket connection failed, continuing without real-time features"
        );
      }

      toast.success("Logged in successfully!");
    } catch (error) {
      console.error("Error logging in with Google:", error);
      set({ isLoggingin: false });
      toast.error(error.response?.data?.message || "Google login failed");
      throw error;
    }
  },
  updateProfile: async (formData) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axios.put("/auth/update-profile", formData);
      set({ authUser: res.data, isUpdatingProfile: false });
      toast.success("Profile updated successfully!"); // Handle success here
    } catch (error) {
      console.error("Error updating profile:", error);
      set({ isUpdatingProfile: false });
      toast.error(error.response?.data?.message || "Profile update failed"); // Handle error here
      throw error; // Re-throw so the component knows it failed
    }
  },
  updateSettings: async (settings) => {
    try {
      const res = await axios.put("/auth/update-settings", settings);
      set({ authUser: res.data });
      toast.success("Settings updated successfully!");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error(error.response?.data?.message || "Settings update failed");
      throw error;
    }
  },
  changePassword: async (passwordData) => {
    try {
      await axios.put("/auth/change-password", passwordData);
      toast.success("Password changed successfully!");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(error.response?.data?.message || "Password change failed");
      throw error;
    }
  },
}));
