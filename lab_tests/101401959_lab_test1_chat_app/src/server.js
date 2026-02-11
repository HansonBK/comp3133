const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const path = require("path");


const connectDB = require("./config/db");


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "..", "view")));

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Chat Server Running ✅");
});

// create server for socket.io
const server = http.createServer(app);

// socket.io setup
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// socket test
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", ({ room, username }) => {
    socket.join(room);
    console.log(`${username} joined room: ${room}`);

    // optional join notification
    io.to(room).emit("room_message", {
      from_user: "System",
      message: `${username} joined the room`,
      date_sent: new Date().toLocaleString(),
    });
  });

  socket.on("leave_room", ({ room, username }) => {
    socket.leave(room);
    console.log(`${username} left room: ${room}`);

    io.to(room).emit("room_message", {
      from_user: "System",
      message: `${username} left the room`,
      date_sent: new Date().toLocaleString(),
    });
  });

  socket.on("send_room_message", (payload) => {
    // payload: { room, from_user, message, date_sent }
    io.to(payload.room).emit("room_message", payload);
  });

  socket.on("typing", ({ room, username }) => {
    socket.to(room).emit("typing", { username });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


// connect MongoDB
connectDB();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
