import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createServer } from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 5000

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

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('joinRoom', (room) => {
    socket.data.room = room;
    socket.join(room);
  });

  socket.on('sendMessage', (data) => {
    socket.to(data.room).emit('receiveMessage', data);
  });

  socket.on('getUsers', async (room) => {
    const sockets = await io.in(room).fetchSockets();
    const users = sockets.map((socket) => socket.id);
    io.in(room).emit('retrieveUsers', users);
  });

  socket.on('disconnect', async () => {
    const room = socket.data.room;
    if (room) {
      const sockets = await io.in(room).fetchSockets();
      const users = sockets.map((socket) => socket.id);
      io.in(room).emit('retrieveUsers', users);
    }
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});