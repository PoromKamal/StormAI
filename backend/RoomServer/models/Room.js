import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
    name: String,
    doc: Buffer,
    lastUpdated: Number
});

const Room = mongoose.model('Room', roomSchema);

export default Room;