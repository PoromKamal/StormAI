import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
    name: String,
    doc: Buffer,
    lastUpdated: Number,
    numUsers: { type: Number, default: 0},
});

const Room = mongoose.model('Room', roomSchema);

export default Room;