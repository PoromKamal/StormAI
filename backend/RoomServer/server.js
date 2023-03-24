import express from 'express';
import mongoose from 'mongoose';
import Room from './models/Room.js';

const PORT = 5555;
const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

app.get('/rooms', async (req, res) => {
  const rooms = await Room.find();
  return res.status(200).json(rooms);
});

app.get('/rooms/:name', async (req, res) => {
  const room = await Room.findOne({ name: req.params.name })
  if (room) {
    return res.status(200).json(room);
  } else {
    return res.status(404).json({ message: 'Room not found' });
  }
});

app.post('/rooms', async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();
    return res.status(201).json(room);
  } catch (err) {
    return res.status(500).json(err);
  }
});

app.listen(PORT, () => console.log(`Room server running on localhost ${PORT}`));
