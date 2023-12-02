const mongoose = require('mongoose');

const Schema = mongoose.Schema;

mongoose.connect("mongodb://0.0.0.0:27017/users")
.then(() => {
    console.log('mongodb connected');
})
.catch(() => {
    console.log('error');
})



const userSchema = new Schema({

    userID: { type: String, required: true },
    roomID: { type: String, required: true },
    isAdmin: { type: Boolean, required: true },
    username: { type: String, required: true },
});

const User = new mongoose.model('User', userSchema);

// Import data to the user in MongoDB database
/*
const importUserData = {
    userID: "1",
    roomID: "Room1",
    isAdmin: true,
    username: "Aaron",
  };

User.insertMany([importUserData]);
*/
module.exports = User;
