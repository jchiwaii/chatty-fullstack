import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/messages.js";
import contactRoutes from "./routes/contact.js";
import groupRoutes from "./routes/group.js";

import dotenv from "dotenv";
import connectDB from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Allow both local development and production frontend URLs
const allowedOrigins = [
  "http://localhost:5173", // Local development
  "http://localhost:5174", // Alternative local port
  "https://chatty-fullstack.vercel.app", // Production frontend on Vercel
  process.env.FRONTEND_URL, // Additional frontend URL from env (optional)
].filter(Boolean); // Remove undefined values

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
  credentials: true,
  optionsSuccessStatus: 204,
  preflightContinue: false,
};

app.use(cors(corsOptions));

// Initialize Socket.IO with CORS configuration
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Store online users
const onlineUsers = new Map();

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId && userId !== "undefined") {
    onlineUsers.set(userId, socket.id);

    // Broadcast online users to all connected clients
    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
  }

  // Handle typing events
  socket.on("typing", ({ receiverId, isTyping }) => {
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userTyping", {
        userId,
        isTyping,
      });
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    if (userId) {
      onlineUsers.delete(userId);
      io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
    }
  });
});

// Make io accessible in routes
app.set("io", io);
app.set("onlineUsers", onlineUsers);

// Increase payload limits for image uploads
app.use(
  express.json({
    limit: "50mb", // Increased from 10mb to 50mb
  })
);
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
  })
);

app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "Chatty API is running!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/groups", groupRoutes);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});
