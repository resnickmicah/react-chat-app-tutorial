import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import { Server as SocketServer } from "socket.io";

import pgSaveMessage from "./services/pg-save-message.js";
import pgGetMessages from "./services/pg-get-messages.js";
import leaveRoom from './utils/leave-room.js';

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

    pgGetMessages(room)
      .then((last100Messages) => {
        // console.log('latest messages', last100Messages);
        socket.emit("last_100_messages", last100Messages);
      })
      .catch((err) => console.log(err));

    let created = new Date().toISOString();
    // Send notification to all users in room except joiner
    socket.to(room).emit("receive_message", {
      msg: `${username} has joined the chat room`,
      username: CHAT_BOT,
      created,
    });

    // Send welcome message to joiner
    socket.emit("receive_message", {
      msg: `Welcome ${username}`,
      username: CHAT_BOT,
      created,
    });

    // Save list of users in a chat room
    chatRoom = room;
    allUsers.push({ id: socket.id, username, room });
    console.log(
      "Added socketID, username, room to allUsers: " +
        `${socket.id}, ${username}, ${room}`
    );
    const chatRoomUsers = allUsers.filter((user) => user.room === room);
    socket.to(room).emit("chatroom_users", chatRoomUsers);
    socket.emit("chatroom_users", chatRoomUsers);
    console.log(`Updated users list for users in room ${room}`);
  });

  socket.on("send_message", (data) => {
    const { msg, username, room, created } = data;
    // Send to all users in room, including sender
    io.in(room).emit("receive_message", data);
    pgSaveMessage(msg, username, room, created)
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  });

  socket.on('leave_room', (data) => {
    const { username, room } = data;
    socket.leave(room);
    const created = (new Date()).toISOString();

    allUsers = leaveRoom(socket.id, allUsers);
    socket.to(room).emit('chatroom_users', allUsers);
    socket.to(room).emit('receive_message', {
      username: CHAT_BOT,
      msg: `${username} has left the chat`,
      created,
    });
    console.log(`${username} has left the chat`);
  });
});

server.listen(4000, () => console.log("Server is running on port 4000"));
