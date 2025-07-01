const mongoose = require('mongoose');
const crypto = require('crypto');


// Encryption configuration
const ENCRYPTION_KEY = Buffer.from(process.env.MESSAGE_ENCRYPTION_KEY, 'hex'); // 32 bytes hex string
const ALGORITHM = process.env.MESSAGE_ENCRYPTION_ALGO;


const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    encryptedContent: {
        type: String,
        required: true
    },
    iv: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent'
    },
    readAt: {
        type: Date,
        default: null
    },
    deliveredAt: {
        type: Date,
        default: null
    },
    editedAt: {
        type: Date,
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    },
    attachment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MessageAttachment',
        default: null
    }
}, {
    timestamps: true
});



// Compound indexes for efficient chat queries
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });
messageSchema.index({ receiver: 1, status: 1 });


// Virtual: Consistent chatRoom ID
messageSchema.virtual('chatRoom').get(function () {
  const participants = [this.sender.toString(), this.receiver.toString()].sort();
  return participants.join('_');
});


// Virtual: Decrypted message content
messageSchema.virtual('content').get(function () {
  if (!this.encryptedContent || !this.iv) return null;

  try {
    const iv = Buffer.from(this.iv, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

    let decrypted = decipher.update(this.encryptedContent, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
});



// Method: Encrypt and set plain text content
messageSchema.methods.setContent = function (plainTextContent) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

  let encrypted = cipher.update(plainTextContent, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  this.encryptedContent = encrypted;
  this.iv = iv.toString('hex');
};



// Method: Mark message as delivered
messageSchema.methods.markAsDelivered = function () {
  this.status = 'delivered';
  this.deliveredAt = new Date();
  return this.save();
};


// Method: Mark message as read
messageSchema.methods.markAsRead = function () {
  this.status = 'read';
  this.readAt = new Date();
  return this.save();
};


// Ensure virtual fields are included in JSON
messageSchema.set('toJSON', { virtuals: true });
messageSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Message', messageSchema);