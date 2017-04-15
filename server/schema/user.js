const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    username: { type: String, required: true, index: { unique: true, dropDups: true } },
    password: String,
    createdAt: { type: Date, default: Date.now },
    roles: { type: [String], required: true }
});
module.exports = mongoose.model('User', UserSchema);
