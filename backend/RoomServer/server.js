import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import Room from './models/Room.js';

const PORT = 5555;
const app = express();
//app.use(express.json({limit: '50mb'}));
app.use(express.json());
app.use(cors());

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

mongoose.connect('mongodb://mongodb_container/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

app.get('/rooms/:id/info', async (req, res) => {
  try {
    // do not include doc in response
    const room = await Room.findById(req.params.id, { doc: 0 });
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

app.get('/rooms/:id/doc', async (req, res) => {
  try {
    // only include doc in response
    const room = await Room.findById(req.params.id, { doc: 1 });
    if (room) {
      return res.status(200).json({ doc: room.doc, success: true });
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

app.patch('/rooms/:id/numUsers', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (room) {
      room.numUsers = req.body.numUsers;
      await room.save();
      return res.status(200).json({ room: room, success: true });
    } else {
      return res.status(404).json({ success: false });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err, success: false });
  }
});

app.patch('/rooms/:id/numUsers/increment', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (room) {
      room.numUsers += 1;
      await room.save();
      return res.status(200).json({ room: room, success: true });
    } else {
      return res.status(404).json({ success: false });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err, success: false });
  }
});

app.patch('/rooms/:id/numUsers/decrement', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (room) {
      room.numUsers -= 1;
      await room.save();
      return res.status(200).json({ room: room, success: true });
    } else {
      return res.status(404).json({ success: false });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err, success: false });
  }
});

app.patch('/rooms/:id/doc', upload.single('doc'), async (req, res) => {
  // Uses multer to receive the docState as a buffer
  const docState = req.file.buffer;
  const lastUpdated = req.body.lastUpdated;
  console.log(docState);
  console.log(lastUpdated);
  console.log('...............');
  try {
    const room = await Room.findById(req.params.id);
    if (room) {
      room.doc = docState;
      room.lastUpdated = lastUpdated;
      await room.save();
      return res.status(200).json({ room: room, success: true });
    } else {
      return res.status(404).json({ success: false });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err, success: false });
  }
});

app.listen(PORT, () => console.log(`Room server running on localhost ${PORT}`));
