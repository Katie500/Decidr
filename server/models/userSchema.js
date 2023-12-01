const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: { type: String, required: true },
    roomID: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
