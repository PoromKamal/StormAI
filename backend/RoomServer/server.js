import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Room from './models/Room.js';

const PORT = 5555;
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

app.get('/rooms/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (room) {
      return res.status(200).json({ room: room, success: true });
    } else {
      return res.status(404).json({ success: false });
    }
  } catch (err) {
    // We end up here if the id is not a valid ObjectId
    return res.status(500).json({ err, success: false });
  }
});

app.post('/rooms', async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();
    return res.status(201).json({ room: room, success: true });
  } catch (err) {
    return res.status(500).json({ err, success: false });
  }
});

app.listen(PORT, () => console.log(`Room server running on localhost ${PORT}`));
