// Instead of using export default, use module.exports
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
