import { create } from "zustand";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

export const useSocket = create((set, get) => ({
  socket: null,
  onlineUsers: [],
  isConnected: false,

  connectSocket: (userId) => {
    const { socket } = get();

    if (socket?.connected) return;

    try {
      const newSocket = io(
        import.meta.env.VITE_REACT_APP_BACKEND_URL || "http://localhost:3000",
        {
          query: { userId },
          transports: ["websocket"],
          timeout: 5000,
        }
      );

      newSocket.on("connect", () => {
        console.log("Connected to server");
        set({ isConnected: true });
      });

      newSocket.on("disconnect", () => {
        console.log("Disconnected from server");
        set({ isConnected: false });
      });

      newSocket.on("connect_error", (error) => {
        console.log("Connection error:", error.message);
        set({ isConnected: false });
        // Don't show error toast for connection issues, just log it
      });

      newSocket.on("getOnlineUsers", (users) => {
        set({ onlineUsers: users });
      });

      newSocket.on("newMessage", (message) => {
        // Create a simple notification sound using Web Audio API
        try {
          const audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.frequency.value = 800;
          oscillator.type = "sine";

          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime + 0.5
          );

          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
          console.log("Audio notification failed:", error);
        }

        // Show toast notification
        toast.success(`New message from ${message.sender.username}`, {
          duration: 3000,
          position: "top-right",
        });
      });

      newSocket.on("userTyping", ({ userId, isTyping }) => {
        // Handle typing indicators
        console.log(
          `User ${userId} is ${isTyping ? "typing" : "stopped typing"}`
        );
      });

      set({ socket: newSocket });
    } catch (error) {
      console.error("Failed to initialize socket:", error);
      set({ isConnected: false });
    }
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket?.connected) {
      socket.disconnect();
    }
    set({ socket: null, isConnected: false, onlineUsers: [] });
  },

  emitTyping: (receiverId, isTyping) => {
    const { socket } = get();
    if (socket?.connected) {
      socket.emit("typing", { receiverId, isTyping });
    }
  },

  isUserOnline: (userId) => {
    const { onlineUsers, isConnected } = get();
    // If not connected to socket, assume users might be online
    if (!isConnected) return false;
    return onlineUsers.includes(userId);
  },
}));
