const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect("mongodb://0.0.0.0:27017/decidr")
.then(() => {
    console.log('Room database connected!');
})
.catch(() => {
    console.log('error');
})

const voteOptionSchema = new Schema({
  option: { type: String, required: true },
  userIDs: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

const roomSchema = new Schema({
  roomID: { type: String, required: true },
  question: { type: String, required: true },
  voteOptions: [voteOptionSchema],
  endTime: { type: Date, required: true },
  ownerUserID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;