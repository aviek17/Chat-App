const mongoose = require('mongoose');
const logger = require("../../../utils/logger");

const contactSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    requestSentBy: {
        type: String,
        trim: true,
        required : true
    },
    contactUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    contactNickname: {
        type: String,
        trim: true
    },
    addedBy: {
        source: { type: String, enum: ['phone', 'email', 'username'], required: true },
        value: { type: String, required: true, trim: true }
    },
    isPending: { type: Boolean, default: true },
    isFavorite: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    isMuted: { type: Boolean, default: false },
    isFriend: { type: Boolean, default: false },
    addedAt: { type: Date, default: Date.now }
}, { timestamps: true });


contactSchema.index({ userId: 1, contactUserId: 1 }, { unique: true });

contactSchema.index({ userId: 1, isPending: 1 });
contactSchema.index({ userId: 1, isBlocked: 1 });
contactSchema.index({ userId: 1, isFavorite: 1 });
contactSchema.index({ userId: 1, isArchived: 1 });
contactSchema.index({ 'addedBy.source': 1, 'addedBy.value': 1 });


// method to add new user in the db if not exists
contactSchema.statics.ensureUserExists = async function (userId) {
    const User = mongoose.model('User');
    return await User.findOneAndUpdate(
        { _id: userId },
        { $setOnInsert: { _id: userId } },
        { new: true, upsert: true }
    );
};


// method to add friend for sender
contactSchema.statics.sendContactRequest = async function (userData) {
    const {
        senderUserId,
        receiverUserId,
        sourceType,
        sourceValue,
        senderNickname,
        receiverNickname,
        senderUserName
    } = { ...userData };

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Row for User A — they sent the request, so not pending for them
        const senderRow = await this.findOneAndUpdate(
            { userId: senderUserId, contactUserId: receiverUserId },
            {
                $setOnInsert: {
                    userId: senderUserId,
                    contactUserId: receiverUserId,
                    requestSentBy : senderUserName,
                    contactNickname: senderNickname || null,
                    addedBy: { source: sourceType, value: sourceValue },
                    isPending: false,
                    addedAt: new Date()
                }
            },
            { new: true, upsert: true, session, setDefaultsOnInsert: true }
        );

        // Row for User B — they received the request, so it is pending for them
        const receiverRow = await this.findOneAndUpdate(
            { userId: receiverUserId, contactUserId: senderUserId },
            {
                $setOnInsert: {
                    userId: receiverUserId,
                    contactUserId: senderUserId,
                    requestSentBy : senderUserName,
                    contactNickname: receiverNickname || null,
                    addedBy: { source: sourceType, value: sourceValue },
                    isPending: true,
                    addedAt: new Date()
                }
            },
            { new: true, upsert: true, session, setDefaultsOnInsert: true }
        );

        await session.commitTransaction();
        logger.info(`Contact request sent: ${senderUserId} → ${receiverUserId}`);
        return { senderRow, receiverRow };

    } catch (err) {
        await session.abortTransaction();
        logger.error('sendContactRequest failed:', err);
        throw err;
    } finally {
        session.endSession();
    }
};



// find contacts by source type for a particular user
contactSchema.statics.getContactsBySource = async function (userId, sourceType) {
    return await this.find({
        userId,
        'addedBy.source': sourceType
    }).populate('contactUserId', 'name email phone username');
};


// find contacts for user by source type
contactSchema.statics.findContactBySource = async function (userId, sourceType, sourceValue) {
    return await this.findOne({
        userId,
        'addedBy.source': sourceType,
        'addedBy.value': sourceValue
    }).populate('contactUserId', 'name email phone username');
};



// getting pending contacts and added contacts for a user
async function fetchContacts(Model, userId, isPending) {
    const contacts = await Model.find({ userId, isPending })
        .sort({ addedAt: -1 })
        .populate({
            path: 'contactUserId',
            select: 'name email username profilePicture',
            populate: {
                path: 'profilePicture',
                select: 'path url filename storageType',
            }
        });

    return contacts.map(contact => {
        const user = contact.contactUserId;
        const pic = user.profilePicture;
        return {
            contactId: contact._id,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                username: user.username,
                ...pic
            }
        };
    });
}


contactSchema.statics.getPendingContacts = function (userId) {
    return fetchContacts(this, userId, true);
};

contactSchema.statics.getContacts = function (userId) {
    return fetchContacts(this, userId, false);
};


module.exports = mongoose.model('UserContact', contactSchema);





