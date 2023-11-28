const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    code: { type: String, required: true, unique: true },
    votes: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
