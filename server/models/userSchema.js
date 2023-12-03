const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  roomID: { type: String, required: false },
  socketID: { type: String, required: true },
  username: { type: String, required: true },
});

const User = new mongoose.model('User', userSchema);

module.exports = User;
