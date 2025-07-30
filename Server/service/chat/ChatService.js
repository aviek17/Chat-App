const ChatRepository = require('../../repo/ChatRepo');

class ChatService {
  
  // Create a new text message
  async createMessage(senderId, receiverId, content) {
    try {
      const messageData = {
        sender: senderId,
        receiver: receiverId,
        status: 'sent', 
        content
      };

      const message = await ChatRepository.createMessage(messageData);

      const populatedMessage = await ChatRepository.getMessageById(message._id, [
        { path: 'sender', select: 'username' },
        { path: 'receiver', select: 'username' }
      ]);
      
      return populatedMessage;
    } catch (error) {
      throw new Error(`Failed to create message: ${error.message}`);
    }
  }

  // Create a message with attachment
  async createMessageWithAttachment(senderId, receiverId, content, attachmentData) {
    try {
      // Create the text message first
      const messageData = {
        sender: senderId,
        receiver: receiverId,
        status: 'sent'
      };

      const message = await ChatRepository.createMessage(messageData);
      message.setContent(content || ''); // Empty content if only attachment
      await message.save();

      // Create the attachment
      const attachmentPayload = {
        message: message._id,
        sender: senderId,
        receiver: receiverId,
        attachmentType: attachmentData.type,
        originalFileName: attachmentData.originalName,
        fileName: attachmentData.fileName,
        fileUrl: attachmentData.url,
        fileSize: attachmentData.size,
        mimeType: attachmentData.mimeType,
        dimensions: attachmentData.dimensions,
        duration: attachmentData.duration,
        thumbnailUrl: attachmentData.thumbnailUrl,
        uploadStatus: 'completed'
      };

      const attachment = await ChatRepository.createMessageAttachment(attachmentPayload);

      // Link attachment to message
      await ChatRepository.updateMessageWithAttachment(message._id, attachment._id);

      // Get populated message
      const populatedMessage = await ChatRepository.getMessageById(message._id, [
        { path: 'sender', select: 'username avatar' },
        { path: 'receiver', select: 'username avatar' },
        { path: 'attachment', select: '' }
      ]);

      return populatedMessage;
    } catch (error) {
      throw new Error(`Failed to create message with attachment: ${error.message}`);
    }
  }

  // Get chat history between two users
  async getChatHistory(userId1, userId2, page = 1, limit = 50) {
    try {
      const messages = await ChatRepository.getChatHistory(userId1, userId2, {
        page,
        limit,
        sortOrder: -1 // Most recent first
      });

      return messages.reverse(); // Return in chronological order
    } catch (error) {
      throw new Error(`Failed to get chat history: ${error.message}`);
    }
  }

  // Mark messages as delivered
  async markMessagesAsDelivered(senderId, receiverId) {
    try {
      const modifiedCount = await ChatRepository.markMessagesAsDelivered(senderId, receiverId);
      return modifiedCount;
    } catch (error) {
      throw new Error(`Failed to mark messages as delivered: ${error.message}`);
    }
  }

  // Mark messages as read
  async markMessagesAsRead(senderId, receiverId) {
    try {
      const modifiedCount = await ChatRepository.markMessagesAsRead(senderId, receiverId);
      return modifiedCount;
    } catch (error) {
      throw new Error(`Failed to mark messages as read: ${error.message}`);
    }
  }

  // Get unread message count
  async getUnreadCount(userId) {
    try {
      const unreadCount = await ChatRepository.getUnreadCount(userId);
      return unreadCount;
    } catch (error) {
      throw new Error(`Failed to get unread count: ${error.message}`);
    }
  }

  // Get unread message count for specific chat partner
  async getUnreadCountByPartner(userId, partnerId) {
    try {
      const unreadCount = await ChatRepository.getUnreadCountByPartner(userId, partnerId);
      return unreadCount;
    } catch (error) {
      throw new Error(`Failed to get unread count by partner: ${error.message}`);
    }
  }

  // Get user's recent chats
  async getRecentChats(userId, limit = 20) {
    try {
      const recentChats = await ChatRepository.getRecentChats(userId, limit);
      return recentChats;
    } catch (error) {
      throw new Error(`Failed to get recent chats: ${error.message}`);
    }
  }

  // Delete message
  async deleteMessage(messageId, userId) {
    try {
      const message = await ChatRepository.findMessageBySender(messageId, userId);

      if (!message) {
        throw new Error('Message not found or unauthorized');
      }

      await ChatRepository.softDeleteMessage(messageId);

      // Also mark attachment as deleted if exists
      if (message.attachment) {
        await ChatRepository.softDeleteAttachment(message.attachment);
      }

      return message;
    } catch (error) {
      throw new Error(`Failed to delete message: ${error.message}`);
    }
  }

  // Delete attachment only (keep text message)
  async deleteAttachment(messageId, userId) {
    try {
      const message = await ChatRepository.findMessageBySender(messageId, userId);

      if (!message) {
        throw new Error('Message not found or unauthorized');
      }

      if (message.attachment) {
        await ChatRepository.softDeleteAttachment(message.attachment);
        
        // Remove attachment reference from message
        await ChatRepository.updateMessageAttachmentReference(messageId, null);
      }

      return message;
    } catch (error) {
      throw new Error(`Failed to delete attachment: ${error.message}`);
    }
  }

  // Get attachments for a chat
  async getChatAttachments(userId1, userId2, attachmentType = null, page = 1, limit = 20) {
    try {
      const attachments = await ChatRepository.getChatAttachments(userId1, userId2, {
        attachmentType,
        page,
        limit
      });

      return attachments;
    } catch (error) {
      throw new Error(`Failed to get chat attachments: ${error.message}`);
    }
  }

  // Get attachment statistics for a chat
  async getChatAttachmentStats(userId1, userId2) {
    try {
      const stats = await ChatRepository.getAttachmentStats(userId1, userId2);
      return stats;
    } catch (error) {
      throw new Error(`Failed to get attachment stats: ${error.message}`);
    }
  }

  // Get messages count between users
  async getMessagesCount(userId1, userId2) {
    try {
      const count = await ChatRepository.getMessagesCount(userId1, userId2);
      return count;
    } catch (error) {
      throw new Error(`Failed to get messages count: ${error.message}`);
    }
  }

  // Get messages by status
  async getMessagesByStatus(userId, status, page = 1, limit = 50) {
    try {
      const messages = await ChatRepository.getMessagesByStatus(userId, status, {
        page,
        limit
      });
      return messages;
    } catch (error) {
      throw new Error(`Failed to get messages by status: ${error.message}`);
    }
  }

  // Search messages
  async searchMessages(userId, searchTerm, page = 1, limit = 20) {
    try {
      const messages = await ChatRepository.searchMessages(userId, searchTerm, {
        page,
        limit
      });
      return messages;
    } catch (error) {
      throw new Error(`Failed to search messages: ${error.message}`);
    }
  }

  // Generate chat room ID
  generateChatRoomId(userId1, userId2) {
    return [userId1, userId2].sort().join('_');
  }

  // Validate message content
  validateMessageContent(content) {
    if (!content || typeof content !== 'string') {
      throw new Error('Message content must be a non-empty string');
    }
    
    if (content.length > 5000) {
      throw new Error('Message content exceeds maximum length of 5000 characters');
    }
    
    return content.trim();
  }

  // Validate attachment data
  validateAttachmentData(attachmentData) {
    const requiredFields = ['type', 'originalName', 'fileName', 'url', 'size', 'mimeType'];
    
    for (const field of requiredFields) {
      if (!attachmentData[field]) {
        throw new Error(`Missing required attachment field: ${field}`);
      }
    }
    
    // Validate file size (max 50MB)
    if (attachmentData.size > 50 * 1024 * 1024) {
      throw new Error('Attachment size exceeds maximum limit of 50MB');
    }
    
    return attachmentData;
  }

  // Check if user can access chat
  async canUserAccessChat(userId, chatPartnerId) {
    try {
      // Add your authorization logic here
      // For example, check if users are friends, blocked, etc.
      
      return true; // Placeholder - implement based on your business rules
    } catch (error) {
      throw new Error(`Failed to check chat access: ${error.message}`);
    }
  }
}

module.exports = new ChatService();