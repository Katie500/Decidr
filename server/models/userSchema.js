const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, default: '1' },
    userID: { type: String, required: true },
    roomID: { type: String, required: true },
    isAdmin: { type: Boolean, required: true },
    username: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
