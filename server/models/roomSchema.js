const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const voteOptionSchema = new Schema({
    option: { type: String, required: true },
    userIDs: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

const roomSchema = new Schema({
    RoomID: { type: String, required: true, unique: true },
    question: { type: String, required: true },
    voteOptions: [voteOptionSchema],
    endTime: { type: Date, required: true },
    ownerUserID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
