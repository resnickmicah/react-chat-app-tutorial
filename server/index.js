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
      "Added socketID, username, room to allUsers:" +
        `${socket.id}, ${username}, ${room}`
    );
    const chatRoomUsers = allUsers.filter((user) => user.room === room);
    socket.to(room).emit("chatroom_users", chatRoomUsers);
    socket.emit("chatroom_users", chatRoomUsers);
    console.log(`Updated users list for users in room ${room}`);
  });

  socket.on("send_message", (data) => {
    const { message, username, room, __createdtime__ } = data;
    // Send to all users in room, including sender
    io.in(room).emit("receive_message", data);
    // Not bothering with this since I don't need to sign up
    // For some proprietary crap to write to a DB...
    // Will figure out Postgres later.
    // harperSaveMessage(message, username, room, __createdtime__)
    //   .then((response) => console.log(response))
    //   .catch((err) => console.log(err));
  });
});

server.listen(4000, () => "Server is running on port 4000");
