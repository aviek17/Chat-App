const Message = require('../models/PrivateMessage');
//const MessageAttachment = require('../models/MessageAttachment');
const User = require('../models/User');
const { ObjectId } = require('mongoose').Types;
const crypto = require('crypto');
const UserContact = require("../models/UserContact");


const ENCRYPTION_KEY = Buffer.from(process.env.MESSAGE_ENCRYPTION_KEY, 'hex');
const ALGORITHM = process.env.MESSAGE_ENCRYPTION_ALGO;

// Helper function to decrypt message content
function decryptContent(encryptedContent, iv) {
    if (!encryptedContent || !iv) return null;

    try {
        const ivBuffer = Buffer.from(iv, 'hex');
        const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, ivBuffer);

        let decrypted = decipher.update(encryptedContent, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (error) {
        console.error('Decryption error:', error);
        return null;
    }
}

class ChatRepository {

    // Create a new message
    async createMessage(messageData) {
        const {
            sender,
            receiver,
            content,
            status
        } = messageData;
        try {
            const message = new Message({
                sender,
                receiver,
                status
            });
            message.setContent(content);
            await message.save();
            return {
                messageId: message._id,
                sender: message.sender,
                receiver: message.receiver,
                messageContent: message.content,
                status: message.status,
                timestamp: message.createdAt
            };
        } catch (error) {
            throw new Error(`Failed to create message: ${error.message}`);
        }
    }

    // Update user online status
    async updateUserOnlineStatus(userId, isOnline) {
        try {
            const user = await User.findByIdAndUpdate(
                userId,
                {
                    isOnline: isOnline,
                    lastSeen: isOnline ? null : new Date()
                },
                { new: true }
            );
            return user;
        } catch (error) {
            throw new Error(`Failed to update user online status: ${error.message}`);
        }
    }

    async updateMessageStatus(filter, updateData) {
        try {
            const result = await Message.updateMany(filter, {
                $set: updateData
            });
            return result.modifiedCount;
        } catch (error) {
            throw new Error(`Failed to update message status: ${error.message}`);
        }
    }

    // get friend id list for this user
    async getFriendIdList(userId) {
        try {
            const friends = await UserContact.find({
                userId,
                isFriend: true
            }).select('contactUserId');
            return friends.map(f => f.contactUserId.toString());
        } catch (err) {
            log.error(`Failed to get friend id list for user ${userId}: ${err.message}`);
            throw new Error(`Failed to get friend id list for user ${userId}: ${err.message}`);
        }
    }

    async getUserDisplayMessage(userId) {

        const contacts = await UserContact.find({
            userId: new ObjectId(userId),
            isFriend: true
        }).select('contactUserId');

        if (!contacts.length) return {};

        const contactIds = contacts.map(c => c.contactUserId);

        const messages = await Message.aggregate([
            {
                $match: {
                    isDeleted: false,
                    $or: [
                        { sender: new ObjectId(userId), receiver: { $in: contactIds } },
                        { receiver: new ObjectId(userId), sender: { $in: contactIds } }
                    ]
                }
            },
            {
                $addFields: {
                    chatPartner: {
                        $cond: {
                            if: { $eq: ['$sender', new ObjectId(userId)] },
                            then: '$receiver',
                            else: '$sender'
                        }
                    },
                    isUnread: {
                        $cond: {
                            if: {
                                $and: [
                                    { $eq: ['$receiver', new ObjectId(userId)] },
                                    { $eq: ['$status', 'delivered'] }
                                ]
                            },
                            then: 1,
                            else: 0
                        }
                    }
                }
            },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: '$chatPartner',
                    lastMessageId: { $first: '$_id' },
                    unreadCount: { $sum: '$isUnread' }
                }
            }
        ]);

        if (!messages.length) return {};

        const lastMessageIds = messages.map(m => m.lastMessageId);

        const messageDocs = await Message.find({
            _id: { $in: lastMessageIds }
        });

        const docMap = {};
        messageDocs.forEach(doc => {
            docMap[doc._id.toString()] = doc;
        });

        const result = {};

        messages.forEach(m => {
            const contactId = m._id.toString();
            const doc = docMap[m.lastMessageId.toString()];

            if (!doc) return;

            result[contactId] = {
                messages: [
                    {
                        messageId: doc._id,
                        messageContent: doc.content,
                        sender: doc.sender,
                        receiver: doc.receiver,
                        timestamp: doc.createdAt,
                        status: doc.status
                    }
                ],
                unreadCount: m.unreadCount
            };
        });

        return result;
    }

    async getUserLastMessages(userId) {
        const contacts = await UserContact.find({
            userId: new ObjectId(userId),
            isFriend: true
        }).select('contactUserId');

        if (!contacts.length) return {};

        const contactIds = contacts.map(c => c.contactUserId);

        // ── Pipeline 1: last 100 messages per contact (display) ──────────────────
        const messages = await Message.aggregate([
            {
                $match: {
                    isDeleted: false,
                    $or: [
                        { sender: new ObjectId(userId), receiver: { $in: contactIds } },
                        { receiver: new ObjectId(userId), sender: { $in: contactIds } }
                    ]
                }
            },
            {
                $addFields: {
                    chatPartner: {
                        $cond: {
                            if: { $eq: ['$sender', new ObjectId(userId)] },
                            then: '$receiver',
                            else: '$sender'
                        }
                    }
                }
            },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: '$chatPartner',
                    messages: { $push: '$$ROOT' }
                }
            },
            {
                $project: {
                    _id: 0,
                    contactUserId: '$_id',
                    messages: { $slice: ['$messages', 100] }
                }
            },
            {
                $set: {
                    messages: { $reverseArray: '$messages' }
                }
            }
        ]);

        // ── Pipeline 2: unread count per contact ───────────
        const unreadCounts = await Message.aggregate([
            {
                $match: {
                    receiver: new ObjectId(userId),
                    sender: { $in: contactIds },
                    status: { $in: ['sent', 'delivered'] },
                    isDeleted: false
                }
            },
            {
                $group: {
                    _id: '$sender',
                    unreadCount: { $sum: 1 }
                }
            }
        ]);

        // Map unreadCounts to { contactId: count } for O(1) lookup
        const unreadMap = {};
        unreadCounts.forEach(({ _id, unreadCount }) => {
            unreadMap[_id.toString()] = unreadCount;
        });

        // ── Merge both results
        const result = {};

        messages.forEach(chat => {
            const contactId = chat.contactUserId.toString();

            result[contactId] = {
                messages: chat.messages.map(msg => ({
                    messageId: msg._id,
                    messageContent: Message.decryptContent(msg.encryptedContent, msg.iv),
                    sender: msg.sender,
                    receiver: msg.receiver,
                    timestamp: msg.createdAt,
                    status: msg.status
                })),
                unreadCount: unreadMap[contactId] ?? 0
            };
        });

        return result;
    }

    // get sender ids based on pending message
    async getSendersWithPendingMessagesAndUpdateStatusDelivered(receiverId) {
        try {
            const pendingMessages = await Message.find({
                receiver: receiverId,
                status: 'sent',
                isDeleted: false
            }).select('sender');

            if (!pendingMessages.length) return [];

            await this.updateMessageStatus(
                { receiver: receiverId, status: 'sent', isDeleted: false },
                { status: 'delivered', deliveredAt: new Date() }
            );

            const senderIds = [...new Set(pendingMessages.map(m => m.sender.toString()))];

            return senderIds;

        } catch (err) {
            log.error(`Failed to get senders with pending messages for receiver ${receiverId}`);
            throw new Error(`Failed to get senders with pending messages for receiver ${receiverId}`);
        }
    }

    // Mark messages as read
    async markMessagesAsRead(senderId, receiverId) {
        try {
            const filter = {
                sender: senderId,
                receiver: receiverId,
                status: { $in: ['sent', 'delivered'] }
            };

            const updateData = {
                status: 'read',
                readAt: new Date()
            };

            return await this.updateMessageStatus(filter, updateData);
        } catch (error) {
            console.log(error)
            throw new Error(`Failed to mark messages as read: ${error.message}`);
        }
    }

}

module.exports = new ChatRepository();