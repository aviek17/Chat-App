const mongoose = require('mongoose');
const logger = require("../../../utils/logger");

const userContactSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    contacts: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            addedBy: {
                source: {
                    type: String,
                    enum: ['phone', 'email', 'username'],
                    required: true
                },
                value: {
                    type: String,
                    required: true,
                    trim: true
                }
            },
            isPending: {
                type: Boolean,
                default: true
            },
            isFavorite: {
                type: Boolean,
                default: false
            },
            isBlocked: {
                type: Boolean,
                default: false
            },
            isArchived: {
                type: Boolean,
                default: false
            },
            isMuted: {
                type: Boolean,
                default: false
            },
            addedAt: { type: Date, default: Date.now },
        }
    ],

}, {
    timestamps: true
})



// Indexes for efficient queries
userContactSchema.index({ userId: 1 });
userContactSchema.index({ 'contacts.user': 1 });
userContactSchema.index({ userId: 1, 'contacts.isBlocked': 1 });
userContactSchema.index({ userId: 1, 'contacts.isFavorite': 1 });


// method to add friend for sender
userContactSchema.methods.addContact = function (contactData) {
    const {
        contactUserId,
        sourceType,
        sourceValue
    } = contactData;

    const existingContact = this.contacts.find(
        contact => contact.user.toString() === contactUserId.toString()
    );

    if (existingContact) {
        logger.error('Contact already exists:', contactUserId);
        throw new Error('Contact already exists');
    }

    this.contacts.push({
        user: contactUserId,
        addedBy: {
            source: sourceType,
            value: sourceValue
        },
        addedAt: new Date()
    });

    return this.save();
};


//method to add friends for both sender and receiver
userContactSchema.methods.addMutualContact = async function (contactData) {
    const {
        contactUserId,
        sourceType,
        sourceValue
    } = contactData;

    const existingContact = this.contacts.find(
        contact => contact.user.toString() === contactUserId.toString()
    );

    if (existingContact) {
        logger.error('Contact already exists:', contactUserId);
        throw new Error('Contact already exists');
    }

    this.contacts.push({
        user: contactUserId,
        addedBy: {
            source: sourceType,
            value: sourceValue
        },
        addedAt: new Date()
    });

    await this.save();

    const UserContact = this.constructor;
    let reverseContactDoc = await UserContact.findOne({ userId: contactUserId });

    if (!reverseContactDoc) {
        reverseContactDoc = new UserContact({ userId: contactUserId, contacts: [] });
    }

    const reverseExists = reverseContactDoc.contacts.find(
        contact => contact.user.toString() === this.userId.toString()
    );

    if (!reverseExists) {
        reverseContactDoc.contacts.push({
            user: this.userId,
            addedBy: {
                source: reverseSourceType || 'auto_added',
                value: reverseSourceValue || 'mutual_contact'
            },
            addedAt: new Date()
        });
        await reverseContactDoc.save();
    }


    return this;
}



userContactSchema.methods.findContactBySource = function (sourceType, sourceValue) {
    return this.contacts.find(contact =>
        contact.addedBy.source === sourceType &&
        contact.addedBy.value === sourceValue
    );
};


userContactSchema.methods.getContactsBySource = function (sourceType) {
    return this.contacts.filter(contact =>
        contact.addedBy.source === sourceType
    );
};


userContactSchema.methods.toggleBlockContact = function (contactUserId, block = true) {
    const contact = this.contacts.find(
        c => c.user.toString() === contactUserId.toString()
    );

    if (!contact) {
        logger.error('Contact not found: ', contactUserId);
        throw new Error('Contact not found');
    }

    contact.isBlocked = block;
    return this.save();
};



userContactSchema.methods.updateLastInteraction = function (contactUserId) {
    const contact = this.contacts.find(
        c => c.user.toString() === contactUserId.toString()
    );

    if (contact) {
        contact.lastInteraction = new Date();
        return this.save();
    }
};


module.exports = mongoose.model('UserContact', userContactSchema);

