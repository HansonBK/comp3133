const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const morgan = require("morgan");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/db");

const GroupMessage = require("./models/GroupMessage");

const PrivateMessage = require("./models/PrivateMessage");


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ✅ serve frontend HTML files
app.use(express.static(path.join(__dirname, "..", "view")));

// ✅ routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.redirect("/login.html");
});


// create server for socket.io
const server = http.createServer(app);

// socket.io setup
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // ✅ Join room + send history
  socket.on("join_room", async ({ room, username }) => {
    socket.join(room);
    console.log(`${username} joined room: ${room}`);

    // send room history ONLY to this user
    try {
      const history = await GroupMessage.find({ room })
        .sort({ _id: 1 })
        .limit(50);

      socket.emit("room_history", history);
    } catch (err) {
      console.error("History load error:", err.message);
    }

    // optional join notification (NOT saved)
    io.to(room).emit("room_message", {
      from_user: "System",
      message: `${username} joined the room`,
      date_sent: new Date().toLocaleString(),
    });
  });

  // ✅ Leave room
  socket.on("leave_room", ({ room, username }) => {
    socket.leave(room);
    console.log(`${username} left room: ${room}`);

    io.to(room).emit("room_message", {
      from_user: "System",
      message: `${username} left the room`,
      date_sent: new Date().toLocaleString(),
    });
  });

  // ✅ Save to MongoDB + broadcast
  socket.on("send_room_message", async (payload) => {
    // payload: { room, from_user, message, date_sent }
    try {
      await GroupMessage.create({
        from_user: payload.from_user,
        room: payload.room,
        message: payload.message,
        date_sent: payload.date_sent,
      });
    } catch (err) {
      console.error("Save message error:", err.message);
    }

    io.to(payload.room).emit("room_message", payload);
  });


  // ✅ load private history between 2 users
socket.on("load_private_history", async ({ from_user, to_user }) => {
  try {
    const history = await PrivateMessage.find({
      $or: [
        { from_user, to_user },
        { from_user: to_user, to_user: from_user }
      ]
    })
      .sort({ _id: 1 })
      .limit(50);

    socket.emit("private_history", history);
  } catch (err) {
    console.error("Private history error:", err.message);
  }
});

// ✅ send private message (save + emit to both sender and receiver)
socket.on("send_private_message", async (payload) => {
  // payload: { from_user, to_user, message, date_sent }
  try {
    await PrivateMessage.create(payload);
  } catch (err) {
    console.error("Save private message error:", err.message);
  }

  // send to receiver + sender (so both see it)
  io.emit("private_message", payload);
});


  // ✅ typing indicator
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
server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
