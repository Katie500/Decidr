const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  roomID: { type: String, required: false },
  socketID: { type: String, required: false },
  username: { type: String, required: true },
  profilePicture: { type: String },
  
});

const User = new mongoose.model('User', userSchema);

module.exports = User;
