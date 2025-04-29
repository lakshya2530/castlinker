const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
require("dotenv").config();
const server = http.createServer(app); // <-- Correct server created

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// Routes imports
const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobs");
const projectRoutes = require("./routes/projectRoutes");
const articleRoutes = require("./routes/articles");
const eventRoutes = require("./routes/events");
const courseRoutes = require("./routes/courses");
const resourceRoutes = require("./routes/resources");
const likeRoutes = require("./routes/likes");
const savedRoutes = require("./routes/savedJobs");
const dashboardRoutes = require("./routes/dashboard");
const userRoutes = require("./routes/users");
const notificationRoutes = require("./routes/notifications");
const chatRoutes = require("./routes/chat");

app.use("/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/jobs", savedRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/chat", chatRoutes);

// Socket.io
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room.`);
  });

  socket.on("send_message", (data) => {
    const { sender_id, receiver_id, content } = data;
    io.to(receiver_id).emit("receive_message", {
      sender_id,
      receiver_id,
      content,
      created_at: new Date(),
    });
    console.log(`Message from ${sender_id} to ${receiver_id}: ${content}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// 🚀 Correct server start
server.listen(3000, () => console.log("Server running on port 3000"));
