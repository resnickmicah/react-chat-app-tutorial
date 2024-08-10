import express from "express";
import http from "http";
import cors from "cors";
import { Server as SocketServer } from "socket.io";

const CHAT_BOT = "ChatBot";
let chatRoom = "";
let allUsers = [];

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    // allow connections from client origin
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);

  socket.on("join_room", (data) => {
    const { username, room } = data;
    console.log(
      `user ${socket.id} joined room ${room} with username ${username}`
    );
    socket.join(room);

    let __createdtime__ = Date.now();
    // Send notification to all users in room except joiner
    socket.to(room).emit("receive_message", {
      message: `${username} has joined the chat room`,
      username: CHAT_BOT,
      __createdtime__,
    });

    // Send welcome message to joiner
    socket.emit("receive_message", {
      message: `Welcome ${username}`,
      username: CHAT_BOT,
      __createdtime__,
    });

    // Save list of users in a chat room
    chatRoom = room;
    allUsers.push({ id: socket.id, username, room });
    console.log(
      "Added socketID, username, room to allUsers:"+
      `${socket.id}, ${username}, ${room}`
    );
    chatRoomUsers = allUsers.filter((user) => user.room === room);
    socket.to(room).emit("chatroom_users", chatRoomUsers);
    socket.emit("chatroom_users", chatRoomUsers);
    console.log(`Updated users list for users in room ${room}`);
  });
});

server.listen(4000, () => "Server is running on port 4000");
