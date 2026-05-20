import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import axios from "axios";
import connectDB from "./config/db.js";

// ROUTES
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import sosRoutes from "./routes/sosRoutes.js";
import guestSOSRoutes from "./routes/guestSOSRoutes.js";
import heatmapRoutes from "./routes/heatmapRoutes.js";
import futureRoutes from "./routes/futureRoutes.js";
import routeRoutes from "./routes/routeRoutes.js";
import FIRRoutes from "./routes/firRoute.js";
import videoRoutes from "./routes/videoRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";

dotenv.config();

const app = express();

connectDB();

// MIDDLEWARE
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173"
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// SOCKET SERVER
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// STORE LIVE USERS
const liveUsers = {};

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // SEND CURRENT LIVE USERS
  socket.emit("live_users_list", Object.values(liveUsers));

  // USER STARTS LIVE
  socket.on("start_live", (user) => {
    liveUsers[socket.id] = {
      socketId: socket.id,
      ...user
    };
    io.emit("live_started", liveUsers[socket.id]);
  });

  // WEBRTC SIGNALING
  socket.on("offer", (data) => {
    io.to(data.target).emit("offer", {
      offer: data.offer,
      sender: socket.id
    });
  });

  socket.on("answer", (data) => {
    io.to(data.target).emit("answer", {
      answer: data.answer,
      sender: socket.id
    });
  });

  socket.on("ice_candidate", (data) => {
    io.to(data.target).emit("ice_candidate", {
      candidate: data.candidate,
      sender: socket.id
    });
  });

  // STOP LIVE
  socket.on("stop_live", () => {
    delete liveUsers[socket.id];
    io.emit("live_stopped", socket.id);
  });

  socket.on("disconnect", () => {
    delete liveUsers[socket.id];
    io.emit("live_stopped", socket.id);
  });
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api", addressRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/guest-sos", guestSOSRoutes);
app.use("/api", heatmapRoutes);
app.use("/api", futureRoutes);
app.use("/api", routeRoutes);
app.use("/api/fir", FIRRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/progress", progressRoutes);

// ROOT
app.get("/", (req, res) => {
  res.send("Raksha API Running 🚀");
});

const AI_BASE_URL = process.env.AI_URL || "http://localhost:8000";

// AI PREDICTION
app.post("/api/predict", async (req, res) => {
  try {
    const { lat, lng } = req.body;

    const response = await axios.post(`${AI_BASE_URL}/predict`, {
      lat,
      lng
    });

    res.json(response.data);

  } catch (err) {
    console.error("AI Error:", err.message);

    res.status(500).json({
      error: "AI service not available"
    });
  }
});

// AI HEALTH
app.get("/api/ai-health", async (req, res) => {
  try {
    const response = await axios.get(`${AI_BASE_URL}/health`);

    res.json({
      ai: response.data.status
    });

  } catch (err) {
    res.status(500).json({
      ai: "AI service offline"
    });
  }
});

// AI ALERT
app.post("/api/ai-alert", (req, res) => {
  try {
    const { type, object, camera } = req.body;

    const alertData = {
      type,
      object,
      camera,
      time: new Date()
    };

    io.emit("ai_alert", alertData);

    res.json({
      message: "AI alert broadcasted"
    });

  } catch (err) {
    res.status(500).json({
      error: "Failed to send AI alert"
    });
  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});