import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server as SocketServer } from 'socket.io';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    // allow connections from client origin
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  }
});

io.on('connection', (socket) => {
  console.log(`User connected ${socket.id}`);
})

server.listen(4000, () => 'Server is running on port 4000');
