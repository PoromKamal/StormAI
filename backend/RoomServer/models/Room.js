import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
    name: String,
});

const Room = mongoose.model('Room', roomSchema);

export default Room;