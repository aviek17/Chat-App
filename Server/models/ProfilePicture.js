const mongoose = require('mongoose');


const ProfilePictureSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    uid: { type: String, required: true, unique: true },
    path: { type: String, required: true, trim: true }, //local path
    filename: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true }, // in bytes
    isActive: { type: Boolean, default: true },
    storageType: {
        type: String,
        enum: ['local', 's3', 'cloudinary'],
        default: 'local'
    },
    url: { type: String }, // for cloud URLs

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {
    timestamps: true
})

ProfilePictureSchema.index({ userId: 1 });

module.exports = mongoose.model('ProfilePhoto', ProfilePictureSchema);