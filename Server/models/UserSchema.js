const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    username: { type: String },
    displayName: { type: String },
    phoneNumber: { type: String },
    bio: { type: String, maxlength: 200 },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },
});

module.exports = mongoose.model('User', UserSchema);