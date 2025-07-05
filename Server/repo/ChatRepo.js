const Message = require('../models/chats/PrivateChat/privateMessage');
//const MessageAttachment = require('../models/MessageAttachment');
const User = require('../models/User');
const { ObjectId } = require('mongoose').Types;

class ChatRepository {

    // Create a new message
    async createMessage(messageData) {
        try {
            const message = new Message(messageData);
            await message.save();
            return message;
        } catch (error) {
            throw new Error(`Failed to create message: ${error.message}`);
        }
    }

    // Create a message attachment
    /*async createMessageAttachment(attachmentData) {
      try {
        const attachment = new MessageAttachment(attachmentData);
        await attachment.save();
        return attachment;
      } catch (error) {
        throw new Error(`Failed to create message attachment: ${error.message}`);
      }
    }
      */
    

    // Update message with attachment reference
   /*async updateMessageWithAttachment(messageId, attachmentId) {
        try {
            const message = await Message.findByIdAndUpdate(
                messageId,
                { attachment: attachmentId },
                { new: true }
            );
            return message;
        } catch (error) {
            throw new Error(`Failed to update message with attachment: ${error.message}`);
        }
    }*/

    // Get message by ID with population
    async getMessageById(messageId, populateOptions = []) {
        try {
            let query = Message.findById(messageId);

            populateOptions.forEach(option => {
                query = query.populate(option.path, option.select);
            });

            return await query.exec();
        } catch (error) {
            throw new Error(`Failed to get message by ID: ${error.message}`);
        }
    }

    // Get chat history between two users
    async getChatHistory(userId1, userId2, options = {}) {
        try {
            const { page = 1, limit = 50, sortOrder = -1 } = options;
            const skip = (page - 1) * limit;

            const messages = await Message.find({
                $or: [
                    { sender: userId1, receiver: userId2 },
                    { sender: userId2, receiver: userId1 }
                ],
                isDeleted: false
            })
                .populate('sender', 'username avatar')
                .populate('receiver', 'username avatar')
                .populate('attachment')
                .sort({ createdAt: sortOrder })
                .skip(skip)
                .limit(limit);

            return messages;
        } catch (error) {
            throw new Error(`Failed to get chat history: ${error.message}`);
        }
    }

    // Update message status
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

    // Mark messages as delivered
    async markMessagesAsDelivered(senderId, receiverId) {
        try {
            const filter = {
                sender: senderId,
                receiver: receiverId,
                status: 'sent'
            };

            const updateData = {
                status: 'delivered',
                deliveredAt: new Date()
            };

            return await this.updateMessageStatus(filter, updateData);
        } catch (error) {
            throw new Error(`Failed to mark messages as delivered: ${error.message}`);
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
            throw new Error(`Failed to mark messages as read: ${error.message}`);
        }
    }

    // Get unread message count
    async getUnreadCount(userId) {
        try {
            const unreadCount = await Message.countDocuments({
                receiver: userId,
                status: { $in: ['sent', 'delivered'] },
                isDeleted: false
            });

            return unreadCount;
        } catch (error) {
            throw new Error(`Failed to get unread count: ${error.message}`);
        }
    }

    // Get unread count by chat partner
    async getUnreadCountByPartner(userId, partnerId) {
        try {
            const unreadCount = await Message.countDocuments({
                sender: partnerId,
                receiver: userId,
                status: { $in: ['sent', 'delivered'] },
                isDeleted: false
            });

            return unreadCount;
        } catch (error) {
            throw new Error(`Failed to get unread count by partner: ${error.message}`);
        }
    }

    // Get user's recent chats using aggregation
    async getRecentChats(userId, limit = 20) {
        try {
            const recentChats = await Message.aggregate([
                {
                    $match: {
                        $or: [{ sender: new ObjectId(userId) }, { receiver: new ObjectId(userId) }],
                        isDeleted: false
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
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $group: {
                        _id: '$chatPartner',
                        lastMessage: { $first: '$$ROOT' },
                        unreadCount: {
                            $sum: {
                                $cond: {
                                    if: {
                                        $and: [
                                            { $eq: ['$receiver', new ObjectId(userId)] },
                                            { $in: ['$status', ['sent', 'delivered']] }
                                        ]
                                    },
                                    then: 1,
                                    else: 0
                                }
                            }
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'userInfo'
                    }
                },
                {
                    $lookup: {
                        from: 'messageattachments',
                        localField: 'lastMessage.attachment',
                        foreignField: '_id',
                        as: 'lastMessage.attachmentInfo'
                    }
                },
                {
                    $unwind: '$userInfo'
                },
                {
                    $addFields: {
                        'lastMessage.attachmentInfo': {
                            $arrayElemAt: ['$lastMessage.attachmentInfo', 0]
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        lastMessage: 1,
                        unreadCount: 1,
                        userInfo: {
                            _id: 1,
                            username: 1,
                            avatar: 1,
                            isOnline: 1,
                            lastSeen: 1
                        }
                    }
                },
                {
                    $sort: { 'lastMessage.createdAt': -1 }
                },
                {
                    $limit: limit
                }
            ]);

            return recentChats;
        } catch (error) {
            throw new Error(`Failed to get recent chats: ${error.message}`);
        }
    }

    // Find message by ID and sender
    async findMessageBySender(messageId, senderId) {
        try {
            const message = await Message.findOne({
                _id: messageId,
                sender: senderId
            });

            return message;
        } catch (error) {
            throw new Error(`Failed to find message by sender: ${error.message}`);
        }
    }

    // Soft delete message
    async softDeleteMessage(messageId) {
        try {
            const message = await Message.findByIdAndUpdate(
                messageId,
                {
                    isDeleted: true,
                    deletedAt: new Date()
                },
                { new: true }
            );

            return message;
        } catch (error) {
            throw new Error(`Failed to soft delete message: ${error.message}`);
        }
    }

    // Update message attachment reference
    async updateMessageAttachmentReference(messageId, attachmentId = null) {
        try {
            const message = await Message.findByIdAndUpdate(
                messageId,
                { attachment: attachmentId },
                { new: true }
            );

            return message;
        } catch (error) {
            throw new Error(`Failed to update message attachment reference: ${error.message}`);
        }
    }

    // Soft delete attachment
    async softDeleteAttachment(attachmentId) {
        try {
            const attachment = await MessageAttachment.findByIdAndUpdate(
                attachmentId,
                {
                    isDeleted: true,
                    deletedAt: new Date()
                },
                { new: true }
            );

            return attachment;
        } catch (error) {
            throw new Error(`Failed to soft delete attachment: ${error.message}`);
        }
    }

    // Get chat attachments
    async getChatAttachments(userId1, userId2, options = {}) {
        try {
            const { attachmentType = null, page = 1, limit = 20 } = options;
            const skip = (page - 1) * limit;

            const matchQuery = {
                $or: [
                    { sender: userId1, receiver: userId2 },
                    { sender: userId2, receiver: userId1 }
                ],
                isDeleted: false
            };

            if (attachmentType) {
                matchQuery.attachmentType = attachmentType;
            }

            const attachments = await MessageAttachment.find(matchQuery)
                .populate('message', 'createdAt')
                .populate('sender', 'username avatar')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            return attachments;
        } catch (error) {
            throw new Error(`Failed to get chat attachments: ${error.message}`);
        }
    }

    // Get attachment by ID
    async getAttachmentById(attachmentId) {
        try {
            const attachment = await MessageAttachment.findById(attachmentId);
            return attachment;
        } catch (error) {
            throw new Error(`Failed to get attachment by ID: ${error.message}`);
        }
    }

    // Get messages count between users
    async getMessagesCount(userId1, userId2) {
        try {
            const count = await Message.countDocuments({
                $or: [
                    { sender: userId1, receiver: userId2 },
                    { sender: userId2, receiver: userId1 }
                ],
                isDeleted: false
            });

            return count;
        } catch (error) {
            throw new Error(`Failed to get messages count: ${error.message}`);
        }
    }

    // Get messages by status
    async getMessagesByStatus(userId, status, options = {}) {
        try {
            const { page = 1, limit = 50 } = options;
            const skip = (page - 1) * limit;

            const messages = await Message.find({
                $or: [{ sender: userId }, { receiver: userId }],
                status: status,
                isDeleted: false
            })
                .populate('sender', 'username avatar')
                .populate('receiver', 'username avatar')
                .populate('attachment')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            return messages;
        } catch (error) {
            throw new Error(`Failed to get messages by status: ${error.message}`);
        }
    }

    // Get attachment statistics
    async getAttachmentStats(userId1, userId2) {
        try {
            const stats = await MessageAttachment.aggregate([
                {
                    $match: {
                        $or: [
                            { sender: userId1, receiver: userId2 },
                            { sender: userId2, receiver: userId1 }
                        ],
                        isDeleted: false
                    }
                },
                {
                    $group: {
                        _id: '$attachmentType',
                        count: { $sum: 1 },
                        totalSize: { $sum: '$fileSize' }
                    }
                }
            ]);

            return stats;
        } catch (error) {
            throw new Error(`Failed to get attachment stats: ${error.message}`);
        }
    }

    // Search messages
    async searchMessages(userId, searchTerm, options = {}) {
        try {
            const { page = 1, limit = 20 } = options;
            const skip = (page - 1) * limit;

            const messages = await Message.find({
                $or: [{ sender: userId }, { receiver: userId }],
                $text: { $search: searchTerm },
                isDeleted: false
            })
                .populate('sender', 'username avatar')
                .populate('receiver', 'username avatar')
                .populate('attachment')
                .sort({ score: { $meta: 'textScore' } })
                .skip(skip)
                .limit(limit);

            return messages;
        } catch (error) {
            throw new Error(`Failed to search messages: ${error.message}`);
        }
    }
}

module.exports = new ChatRepository();