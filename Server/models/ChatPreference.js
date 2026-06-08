const mongoose = require('mongoose');
const logger = require('../../utils/logger');

const ChatPreferenceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    friendId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // every functionality will be based for userId (not friend id)
    clearedAt: {
        type: Date,
        default: null
    },

    isHidden: {
        type: Boolean,
        default: false
    },
    hiddenAt: {
        type: Date,
        default: null
    },

    isBlocked: {
        type: Boolean,
        default: false
    },
    blockedAt: {
        type: Date,
        default: null
    },

    isFavorite: {
        type: Boolean,
        default: false
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    // isMuted: false, mutedUntil: null  →  NOT muted
    // isMuted: true,  mutedUntil: null  →  muted FOREVER
    // isMuted: true,  mutedUntil: Date  →  muted UNTIL that date
    isMuted: {
        type: Boolean,
        default: false
    },
    mutedUntil: {
        type: Date,
        default: null
    },

    // will be implemented later
    // disappearingMessages: {
    //     enabled:  { type: Boolean, default: false },
    //     duration: { type: Number,  default: null  }  
    // }

}, { timestamps: true })



// ── Indexes ────────────────────────────────────────────────────────
ChatPreferenceSchema.index({ userId: 1, friendId: 1 }, { unique: true });
ChatPreferenceSchema.index({ userId: 1, isHidden: 1 });                  // fetched non hidden items
ChatPreferenceSchema.index({ userId: 1, isArchived: 1 });                 // archived list
ChatPreferenceSchema.index({ userId: 1, isFavorite: 1 });                 // favorites list
ChatPreferenceSchema.index({ userId: 1, isBlocked: 1 });                  // blocked list



// Create two rows when friend request is accepted
ChatPreferenceSchema.statics.initializeForFriendship = async function (userAId, userBId, session = null) {
    const options = session ? { session } : {};
    try {
        await this.insertMany([
            { userId: userAId, friendId: userBId },
            { userId: userBId, friendId: userAId }
        ], options);
        logger.info(`ChatPreferences initialized for ${userAId} ↔ ${userBId}`);
    } catch (err) {
        logger.error('ChatPreferences.initializeForFriendship failed:', err);
        throw err;
    }
};

// get all preferences
ChatPreferenceSchema.statics.getPreferences = async function (userId, friendId) {
    return await this.findOne({ userId, friendId });
};


// clear chat for userId (logged in user)
ChatPreferenceSchema.statics.clearChat = async function (userId, friendId) {
    return await this.findOneAndUpdate(
        { userId, friendId },
        { $set: { clearedAt: new Date() } },
        { new: true }
    );
};

//hide a conversation for a user
ChatPreferenceSchema.statics.deleteConversation = async function (userId, friendId) {
    return await this.findOneAndUpdate(
        { userId, friendId },
        { $set: { isHidden: true, hiddenAt: new Date() } },
        { new: true }
    );
};

// unhide conversation
ChatPreferenceSchema.statics.unhideConversation = async function (userId, friendId) {
    return await this.findOneAndUpdate(
        { userId, friendId },
        { $set: { isHidden: false, hiddenAt: null } },
        { new: true }
    );
};


// Block user
ChatPreferenceSchema.statics.blockUser = async function (userId, friendId) {
    return await this.findOneAndUpdate(
        { userId, friendId },
        { $set: { isBlocked: true, blockedAt: new Date() } },
        { new: true }
    );
};

// Unblock user
ChatPreferenceSchema.statics.unblockUser = async function (userId, friendId) {
    return await this.findOneAndUpdate(
        { userId, friendId },
        { $set: { isBlocked: false, blockedAt: null } },
        { new: true }
    );
};

// Toggle favorite
ChatPreferenceSchema.statics.toggleFavorite = async function (userId, friendId) {
    const prefs = await this.findOne({ userId, friendId });
    if (!prefs) throw new Error('Preferences not found');
    return await this.findOneAndUpdate(
        { userId, friendId },
        { $set: { isFavorite: !prefs.isFavorite } },
        { new: true }
    );
};

// Mute conversation
ChatPreferenceSchema.statics.muteConversation = async function (userId, friendId, hours = null) {
    const mutedUntil = hours ? new Date(Date.now() + hours * 60 * 60 * 1000) : null;
    return await this.findOneAndUpdate(
        { userId, friendId },
        { $set: { isMuted: true, mutedUntil } },
        { new: true }
    );
};

// Unmute conversation
ChatPreferenceSchema.statics.unmuteConversation = async function (userId, friendId) {
    return await this.findOneAndUpdate(
        { userId, friendId },
        { $set: { isMuted: false, mutedUntil: null } },
        { new: true }
    );
};


// Toggle archive
ChatPreferenceSchema.statics.toggleArchive = async function (userId, friendId) {
    const prefs = await this.findOne({ userId, friendId });
    if (!prefs) throw new Error('Preferences not found');
    return await this.findOneAndUpdate(
        { userId, friendId },
        { $set: { isArchived: !prefs.isArchived } },
        { new: true }
    );
};

// Check if user is blocked — used before sending messages
ChatPreferenceSchema.statics.isBlocked = async function (userId, friendId) {
    const prefs = await this.findOne({ userId, friendId });
    return prefs?.isBlocked ?? false;
};


// Apply preferences filter to a messages array
ChatPreferenceSchema.methods.filterMessages = function (messages) {
    if (!messages?.length) return [];
    if (!this.clearedAt) return messages;
    return messages.filter(msg => msg.createdAt > this.clearedAt);
};

// Check if mute is still active
ChatPreferenceSchema.methods.isMuteActive = function () {
    if (!this.isMuted) return false;
    if (!this.mutedUntil) return true;
    return new Date() < this.mutedUntil;
};


module.exports = mongoose.model('ChatPreferences', ChatPreferenceSchema);