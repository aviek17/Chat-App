const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    uid:            { type: String, required: true, unique: true },
    email:          { type: String, required: true, unique: true, trim: true, },
    username:       { type: String, trim: true, },
    displayName:    { type: String, trim: true, },
    phoneNumber:    { type: String },
    bio:            { type: String, maxlength: 200 },
    isVerified:     { type: Boolean, default: false },
    createdAt:      { type: Date, default: Date.now },
    lastLogin:      { type: Date },
    password:       { type: String, minlength: 6, select: false, required : true }
});


UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('User', UserSchema);