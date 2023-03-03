import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createServer } from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 5000

class Room {
  constructor(user) {
    this.users = [user];
    this.paths = [];
  }
}

const app = express();
app.use(bodyParser.json());
app.use(cors());

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const rooms = {};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('createRoom', (user) => {
    const room = new Room(user);
    let roomId
    do {
      roomId = Math.floor(Math.random() * 1000000).toString();
    } while (rooms[roomId]);

    rooms[roomId] = room;
    socket.join(roomId);
    socket.data.room = roomId;
    socket.emit('roomCreated', roomId);
    console.log(`Created room: ${roomId}`);
    console.log(`All rooms:`, rooms);
  });

  socket.on('joinRoom', (roomId) => {
    const room = rooms[roomId];
    if (room) {
      room.users.push(socket.id);
      socket.join(roomId);
      socket.data.room = roomId;
      socket.emit('joinedRoom', roomId, room.paths);
      console.log(`Joined room: ${roomId}`);
      console.log(`All rooms:`, rooms);
    } else {
      socket.emit('roomNotFound');
    }
  });

  socket.on('pingRoom', (roomId) => {
    const room = rooms[roomId];
    if (room) {
      io.to(roomId).emit('receivePing', roomId);
    }
  });

  socket.on('getUsers', async (roomId) => {
    const users = rooms[roomId].users;
    io.to(roomId).emit('retrieveUsers', users);
  });

  socket.on('draw', (x, y) => {
    const roomId = socket.data.room;
    roomId && (socket.to(roomId).emit('draw', x, y));
  });

  socket.on('savePath', (path) => {
    const roomId = socket.data.room;
    if (roomId) {
      rooms[roomId].paths.push(path);
      socket.to(roomId).emit('savePath', path);
    }
  });

  socket.on('down', (x, y) => {
    const roomId = socket.data.room;
    socket.to(roomId).emit('ondown', x, y);
  });

  socket.on('disconnect', async () => {
    const room = socket.data.room;
    if (room) {
      const sockets = await io.in(room).fetchSockets();
      const users = sockets.map((socket) => socket.id);
      rooms[room].users = users;
      io.in(room).emit('retrieveUsers', users);
    }
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});