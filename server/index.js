require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const Message = require("./models/Message");

const app = express();
const server = http.createServer(app);

// ─── CORS ────────────────────────────────────────────────────────────────────
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// ─── Socket.io ───────────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve React build in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
}

// ─── MongoDB ──────────────────────────────────────────────────────────────────
const MONGO_URL =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/telechat";

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// ─── REST API Routes ──────────────────────────────────────────────────────────

// GET: last 50 messages for a room
app.get("/api/messages/:room", async (req, res) => {
  try {
    const { room } = req.params;
    const messages = await Message.find({ room })
      .sort({ createdAt: 1 })
      .limit(50);
    res.json({ success: true, messages });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch messages." });
  }
});

// GET: list of unique active rooms
app.get("/api/rooms", async (req, res) => {
  try {
    const rooms = await Message.distinct("room");
    // ensure 'global' is always present
    if (!rooms.includes("global")) rooms.unshift("global");
    res.json({ success: true, rooms });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch rooms." });
  }
});

// Catch-all → React app in production
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}

// ─── Socket.io Events ─────────────────────────────────────────────────────────
// Track online users per room:  room → Set<username>
const roomUsers = {};

io.on("connection", (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  // User joins a room
  socket.on("join_room", ({ username, room }) => {
    // Leave all previous rooms (except own socket room)
    Object.keys(roomUsers).forEach((r) => {
      if (roomUsers[r]) roomUsers[r].delete(socket.username || "");
    });

    socket.join(room);
    socket.username = username;
    socket.room = room;

    if (!roomUsers[room]) roomUsers[room] = new Set();
    roomUsers[room].add(username);

    // Broadcast updated user list to room
    io.to(room).emit("room_users", {
      room,
      users: Array.from(roomUsers[room]),
    });

    // Notify others
    socket.to(room).emit("system_message", {
      text: `${username} joined the chat`,
      createdAt: new Date().toISOString(),
    });

    console.log(`👤 ${username} joined room: ${room}`);
  });

  // User sends a message
  socket.on("send_message", async ({ from, room, text }) => {
    if (!text || !text.trim()) return;

    try {
      const message = new Message({ from, room, text: text.trim() });
      await message.save();

      // Emit to everyone in the room (including sender)
      io.to(room).emit("receive_message", {
        _id: message._id,
        from: message.from,
        text: message.text,
        room: message.room,
        createdAt: message.createdAt,
      });
    } catch (err) {
      // Emit error only to the sender
      socket.emit("message_error", {
        error: "Message could not be sent. Please try again.",
      });
      console.error("❌ Save error:", err.message);
    }
  });

  // User typing indicator
  socket.on("typing", ({ username, room }) => {
    socket.to(room).emit("user_typing", { username });
  });

  socket.on("stop_typing", ({ room }) => {
    socket.to(room).emit("user_stop_typing");
  });

  // Disconnect
  socket.on("disconnect", () => {
    const { username, room } = socket;
    if (room && roomUsers[room]) {
      roomUsers[room].delete(username);
      io.to(room).emit("room_users", {
        room,
        users: Array.from(roomUsers[room]),
      });
      io.to(room).emit("system_message", {
        text: `${username} left the chat`,
        createdAt: new Date().toISOString(),
      });
    }
    console.log(`🔌 Socket disconnected: ${socket.id}`);
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 TeleChat server running on port ${PORT}`);
});
