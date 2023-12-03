const mongoose = require('mongoose');

const Schema = mongoose.Schema;

mongoose.connect("mongodb://0.0.0.0:27017/decidr")
  .then(() => {
    console.log('User database connected!');
  })
  .catch(() => {
    console.log('Error connecting to the user database');
  });

const userSchema = new Schema({
    roomID: { type: String, required: true },
    isAdmin: { type: Boolean, required: true },
    username: { type: String, required: true },
});

const User = new mongoose.model('User', userSchema);

module.exports = User;
