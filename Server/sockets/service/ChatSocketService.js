const ChatService = require('../../service/chat/ChatService');
const ChatRepository = require('../../repo/ChatRepo');
const { validateObjectId, validateMessageContent } = require('../../validation/message');
const log = require('../../utils/logger');

class ChatSocketService {
  constructor(io) {
    this.io = io;
    this.chatRepository = ChatRepository;
    this.activeUsers = new Map(); // userId -> socketId
    this.typingUsers = new Map(); // "senderId-receiverId" -> timestamp
    this.userRooms = new Map(); // userId -> Set of room IDs for group chats
  }

  // Initialize socket connection
  initializeConnection(socket) {
    console.log(`User connected: ${socket.id}`);
    
    // Import and use controller
    const ChatSocketController = require('../controllers/ChatSocketController');
    const controller = new ChatSocketController(this);
    controller.initializeEventHandlers(socket);
  }
  
  // Add active user
  addActiveUser(userId, socketId) {
    this.activeUsers.set(userId, socketId);
  }

  // Remove active user
  removeActiveUser(userId) {
    this.activeUsers.delete(userId);
  }

  // Get user socket ID
  getUserSocketId(userId) {
    return this.activeUsers.get(userId);
  }

  // Handle user authentication
  async addCurrentUserToOnlineUsersList(socket, data) {
    try {
      const { userId } = data;
      if (!validateObjectId(userId)) {
        socket.emit('auth_error', { message: 'Invalid user ID' });
        return;
      }

      // Store user connection
      this.activeUsers.set(userId, socket.id);
      socket.userId = userId;
      // socket.emit('authenticate', { userId: userId });

      // Update user online status
      await this.chatRepository.updateUserOnlineStatus(userId, true);

      // Get and send recent chats
      const recentChats = await ChatService.getRecentChats(userId);
      
      socket.emit('authenticate', {
        message: 'Welcome to Talk Sphere',
        recentChats,
        userId
      });

      // Notify contacts that user is online
      //this.broadcastUserStatus(userId, 'online');

      log.success(`User ${userId} authenticated with socket ${socket.id}`);
    } catch (error) {
      console.log(error)
      log.error('Authentication error:', error);
      socket.emit('auth_error', { message: 'Authentication failed' });
    }
  }

  // Handle sending text message
  async handleSendMessage(socket, data) {
    try {
      const { receiverId, content } = data;
      const senderId = socket.userId;

      if (!senderId) {
        socket.emit('error', { message: 'Not authenticated' });
        return;
      }

      if (!validateObjectId(receiverId)) {
        socket.emit('error', { message: 'Invalid receiver ID' });
        return;
      }

      // Validate message content using ChatService method
      const validatedContent = validateMessageContent(content);

      if(!validatedContent){
        socket.emit('error', { message: 'Invalid message content' });
        return;
      }

      // Create message using ChatService
      const message = await ChatService.createMessage(senderId, receiverId, content);

      // Emit to sender (confirmation)
      socket.emit('message_sent', { message : message.content });


      const receiverSocketId = this.activeUsers.get(receiverId);
      console.log(receiverSocketId)
      if (receiverSocketId) {
        console.log("Message sent to receiver:",receiverId,  message.content);
        this.io.to(receiverSocketId).emit('message_received', { message : message.content });
        this.io.to(receiverId).emit('message_received', { message : message.content });
        console.log(`Message sent to receiver ${receiverSocketId}:`, message.content);
        await ChatService.markMessagesAsDelivered(senderId, receiverId);
        socket.emit('message_delivered', { 
          messageId: message._id, 
          receiverId 
        });
      }

      // Update recent chats for both users
      this.updateRecentChats([senderId, receiverId]);

    } catch (error) {
      console.error('❌ Send message error:', error);
      socket.emit('error', { message: error.message || 'Failed to send message' });
    }
  }

  // Handle sending message with attachment
  /*async handleSendMessageWithAttachment(socket, data) {
    try {
      const { receiverId, content, attachmentData } = data;
      const senderId = socket.userId;

      if (!senderId) {
        socket.emit('error', { message: 'Not authenticated' });
        return;
      }

      if (!validateObjectId(receiverId)) {
        socket.emit('error', { message: 'Invalid receiver ID' });
        return;
      }

      // Validate attachment data using ChatService method
      const validatedAttachmentData = ChatService.validateAttachmentData(attachmentData);

      // Validate content if provided
      const validatedContent = content ? ChatService.validateMessageContent(content) : '';

      // Check if user can access this chat
      const canAccess = await ChatService.canUserAccessChat(senderId, receiverId);
      if (!canAccess) {
        socket.emit('error', { message: 'Access denied to this chat' });
        return;
      }

      // Create message with attachment using ChatService
      const message = await ChatService.createMessageWithAttachment(
        senderId, 
        receiverId, 
        validatedContent, 
        validatedAttachmentData
      );

      // Emit to sender
      socket.emit('message_sent', { message });

      // Emit to receiver if online
      const receiverSocketId = this.activeUsers.get(receiverId);
      if (receiverSocketId) {
        this.io.to(receiverSocketId).emit('message_received', { message });
        
        // Auto-mark as delivered since receiver is online
        await ChatService.markMessagesAsDelivered(senderId, receiverId);
        socket.emit('message_delivered', { 
          messageId: message._id, 
          receiverId 
        });
      }

      // Update recent chats for both users
      this.updateRecentChats([senderId, receiverId]);

    } catch (error) {
      console.error('❌ Send message with attachment error:', error);
      socket.emit('error', { message: error.message || 'Failed to send message with attachment' });
    }
  }
    */

  // Handle message delivered acknowledgment
  async handleMessageDelivered(socket, data) {
    try {
      const { senderId } = data;
      const receiverId = socket.userId;

      if (!receiverId || !validateObjectId(senderId)) {
        return;
      }

      // Mark messages as delivered using ChatService
      const modifiedCount = await ChatService.markMessagesAsDelivered(senderId, receiverId);
      
      if (modifiedCount > 0) {
        // Notify sender about delivery
        const senderSocketId = this.activeUsers.get(senderId);
        if (senderSocketId) {
          this.io.to(senderSocketId).emit('message_delivered', {
            receiverId,
            count: modifiedCount
          });
        }
      }

    } catch (error) {
      console.error('❌ Message delivered error:', error);
    }
  }

  // Handle message read acknowledgment
  async handleMessageRead(socket, data) {
    try {
      const { senderId } = data;
      const receiverId = socket.userId;

      if (!receiverId || !validateObjectId(senderId)) {
        return;
      }

      // Mark messages as read using ChatService
      const modifiedCount = await ChatService.markMessagesAsRead(senderId, receiverId);
      
      if (modifiedCount > 0) {
        // Notify sender about read status
        const senderSocketId = this.activeUsers.get(senderId);
        if (senderSocketId) {
          this.io.to(senderSocketId).emit('messages_read', {
            receiverId,
            count: modifiedCount
          });
        }

        // Update unread count for receiver
        const unreadCount = await ChatService.getUnreadCount(receiverId);
        socket.emit('unread_count_updated', { unreadCount });
      }

    } catch (error) {
      console.error('❌ Message read error:', error);
    }
  }

  // Handle delete message
  async handleDeleteMessage(socket, data) {
    try {
      const { messageId } = data;
      const userId = socket.userId;

      if (!userId || !validateObjectId(messageId)) {
        socket.emit('error', { message: 'Invalid request data' });
        return;
      }

      // Delete message using ChatService
      const deletedMessage = await ChatService.deleteMessage(messageId, userId);

      // Emit confirmation to sender
      socket.emit('message_deleted', { messageId });

      // Notify the other user about message deletion
      const otherUserId = deletedMessage.sender.toString() === userId 
        ? deletedMessage.receiver.toString() 
        : deletedMessage.sender.toString();
      
      const otherUserSocketId = this.activeUsers.get(otherUserId);
      if (otherUserSocketId) {
        this.io.to(otherUserSocketId).emit('message_deleted', { messageId });
      }

      // Update recent chats for both users
      this.updateRecentChats([userId, otherUserId]);

    } catch (error) {
      console.error('❌ Delete message error:', error);
      socket.emit('error', { message: error.message || 'Failed to delete message' });
    }
  }

  // Handle delete attachment
  async handleDeleteAttachment(socket, data) {
    try {
      const { messageId } = data;
      const userId = socket.userId;

      if (!userId || !validateObjectId(messageId)) {
        socket.emit('error', { message: 'Invalid request data' });
        return;
      }

      // Delete attachment using ChatService
      const message = await ChatService.deleteAttachment(messageId, userId);

      // Emit confirmation to sender
      socket.emit('attachment_deleted', { messageId });

      // Notify the other user about attachment deletion
      const otherUserId = message.sender.toString() === userId 
        ? message.receiver.toString() 
        : message.sender.toString();
      
      const otherUserSocketId = this.activeUsers.get(otherUserId);
      if (otherUserSocketId) {
        this.io.to(otherUserSocketId).emit('attachment_deleted', { messageId });
      }

    } catch (error) {
      console.error('❌ Delete attachment error:', error);
      socket.emit('error', { message: error.message || 'Failed to delete attachment' });
    }
  }

  // Handle get chat history
  async handleGetChatHistory(socket, data) {
    try {
      const { otherUserId, page = 1, limit = 50 } = data;
      const userId = socket.userId;

      if (!userId || !validateObjectId(otherUserId)) {
        socket.emit('error', { message: 'Invalid user IDs' });
        return;
      }

      // Check if user can access this chat
      const canAccess = await ChatService.canUserAccessChat(userId, otherUserId);
      if (!canAccess) {
        socket.emit('error', { message: 'Access denied to this chat' });
        return;
      }

      // Get chat history using ChatService
      const messages = await ChatService.getChatHistory(userId, otherUserId, page, limit);
      
      socket.emit('chat_history', {
        messages,
        otherUserId,
        page,
        hasMore: messages.length === limit
      });

    } catch (error) {
      console.error('❌ Get chat history error:', error);
      socket.emit('error', { message: 'Failed to get chat history' });
    }
  }

  // Handle get recent chats
  async handleGetRecentChats(socket, data) {
    try {
      const { limit = 20 } = data || {};
      const userId = socket.userId;

      if (!userId) {
        socket.emit('error', { message: 'Not authenticated' });
        return;
      }

      // Get recent chats using ChatService
      const recentChats = await ChatService.getRecentChats(userId, limit);
      
      socket.emit('recent_chats', { recentChats });

    } catch (error) {
      console.error('❌ Get recent chats error:', error);
      socket.emit('error', { message: 'Failed to get recent chats' });
    }
  }

  // Handle get unread count
  async handleGetUnreadCount(socket, data) {
    try {
      const userId = socket.userId;

      if (!userId) {
        socket.emit('error', { message: 'Not authenticated' });
        return;
      }

      // Get unread count using ChatService
      const unreadCount = await ChatService.getUnreadCount(userId);
      
      socket.emit('unread_count', { unreadCount });

    } catch (error) {
      console.error('❌ Get unread count error:', error);
      socket.emit('error', { message: 'Failed to get unread count' });
    }
  }

  // Handle get unread count by partner
  async handleGetUnreadCountByPartner(socket, data) {
    try {
      const { partnerId } = data;
      const userId = socket.userId;

      if (!userId || !validateObjectId(partnerId)) {
        socket.emit('error', { message: 'Invalid parameters' });
        return;
      }

      // Get unread count by partner using ChatService
      const unreadCount = await ChatService.getUnreadCountByPartner(userId, partnerId);
      
      socket.emit('unread_count_by_partner', { partnerId, unreadCount });

    } catch (error) {
      console.error('❌ Get unread count by partner error:', error);
      socket.emit('error', { message: 'Failed to get unread count by partner' });
    }
  }

  // Handle get messages count
  async handleGetMessagesCount(socket, data) {
    try {
      const { otherUserId } = data;
      const userId = socket.userId;

      if (!userId || !validateObjectId(otherUserId)) {
        socket.emit('error', { message: 'Invalid user IDs' });
        return;
      }

      // Get messages count using ChatService
      const count = await ChatService.getMessagesCount(userId, otherUserId);
      
      socket.emit('messages_count', { otherUserId, count });

    } catch (error) {
      console.error('❌ Get messages count error:', error);
      socket.emit('error', { message: 'Failed to get messages count' });
    }
  }

  // Handle get messages by status
  async handleGetMessagesByStatus(socket, data) {
    try {
      const { status, page = 1, limit = 50 } = data;
      const userId = socket.userId;

      if (!userId || !status) {
        socket.emit('error', { message: 'Invalid parameters' });
        return;
      }

      // Get messages by status using ChatService
      const messages = await ChatService.getMessagesByStatus(userId, status, page, limit);
      
      socket.emit('messages_by_status', {
        messages,
        status,
        page,
        hasMore: messages.length === limit
      });

    } catch (error) {
      console.error('❌ Get messages by status error:', error);
      socket.emit('error', { message: 'Failed to get messages by status' });
    }
  }

  // Handle search messages
  async handleSearchMessages(socket, data) {
    try {
      const { searchTerm, page = 1, limit = 20 } = data;
      const userId = socket.userId;

      if (!userId || !searchTerm) {
        socket.emit('error', { message: 'Invalid search parameters' });
        return;
      }

      // Search messages using ChatService
      const messages = await ChatService.searchMessages(userId, searchTerm, page, limit);
      
      socket.emit('search_results', {
        messages,
        searchTerm,
        page,
        hasMore: messages.length === limit
      });

    } catch (error) {
      console.error('❌ Search messages error:', error);
      socket.emit('error', { message: 'Failed to search messages' });
    }
  }

  // Handle get chat attachments
  async handleGetChatAttachments(socket, data) {
    try {
      const { otherUserId, attachmentType = null, page = 1, limit = 20 } = data;
      const userId = socket.userId;

      if (!userId || !validateObjectId(otherUserId)) {
        socket.emit('error', { message: 'Invalid user IDs' });
        return;
      }

      // Get chat attachments using ChatService
      const attachments = await ChatService.getChatAttachments(userId, otherUserId, attachmentType, page, limit);
      
      socket.emit('chat_attachments', {
        attachments,
        otherUserId,
        attachmentType,
        page,
        hasMore: attachments.length === limit
      });

    } catch (error) {
      console.error('❌ Get chat attachments error:', error);
      socket.emit('error', { message: 'Failed to get chat attachments' });
    }
  }

  // Handle get chat attachment stats
  async handleGetChatAttachmentStats(socket, data) {
    try {
      const { otherUserId } = data;
      const userId = socket.userId;

      if (!userId || !validateObjectId(otherUserId)) {
        socket.emit('error', { message: 'Invalid user IDs' });
        return;
      }

      // Get attachment stats using ChatService
      const stats = await ChatService.getChatAttachmentStats(userId, otherUserId);
      
      socket.emit('chat_attachment_stats', { otherUserId, stats });

    } catch (error) {
      console.error('❌ Get chat attachment stats error:', error);
      socket.emit('error', { message: 'Failed to get attachment stats' });
    }
  }

  // Handle typing start
  handleTypingStart(socket, data) {
    try {
      const { receiverId } = data;
      const senderId = socket.userId;

      if (!senderId || !validateObjectId(receiverId)) {
        return;
      }

      const typingKey = `${senderId}-${receiverId}`;
      this.typingUsers.set(typingKey, Date.now());

      // Notify receiver
      const receiverSocketId = this.activeUsers.get(receiverId);
      if (receiverSocketId) {
        this.io.to(receiverSocketId).emit('user_typing', {
          senderId,
          isTyping: true
        });
      }

      // Auto-stop typing after 3 seconds
      setTimeout(() => {
        if (this.typingUsers.has(typingKey)) {
          this.handleTypingStop(socket, { receiverId });
        }
      }, 3000);

    } catch (error) {
      console.error('❌ Typing start error:', error);
    }
  }

  // Handle typing stop
  handleTypingStop(socket, data) {
    try {
      const { receiverId } = data;
      const senderId = socket.userId;

      if (!senderId || !validateObjectId(receiverId)) {
        return;
      }

      const typingKey = `${senderId}-${receiverId}`;
      this.typingUsers.delete(typingKey);

      // Notify receiver
      const receiverSocketId = this.activeUsers.get(receiverId);
      if (receiverSocketId) {
        this.io.to(receiverSocketId).emit('user_typing', {
          senderId,
          isTyping: false
        });
      }

    } catch (error) {
      console.error('❌ Typing stop error:', error);
    }
  }

  // Handle join room (for group chats)
  async handleJoinRoom(socket, data) {
    try {
      const { roomId } = data;
      const userId = socket.userId;

      if (!userId || !validateObjectId(roomId)) {
        socket.emit('error', { message: 'Invalid room ID' });
        return;
      }

      // Generate chat room ID using ChatService method
      const chatRoomId = ChatService.generateChatRoomId(userId, roomId);

      // Join the room
      socket.join(chatRoomId);
      
      // Track user rooms
      if (!this.userRooms.has(userId)) {
        this.userRooms.set(userId, new Set());
      }
      this.userRooms.get(userId).add(chatRoomId);

      socket.emit('room_joined', { roomId: chatRoomId });

    } catch (error) {
      console.error('❌ Join room error:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  }

  // Handle leave room
  async handleLeaveRoom(socket, data) {
    try {
      const { roomId } = data;
      const userId = socket.userId;

      if (!userId || !validateObjectId(roomId)) {
        return;
      }

      // Leave the room
      socket.leave(roomId);
      
      // Remove from user rooms tracking
      if (this.userRooms.has(userId)) {
        this.userRooms.get(userId).delete(roomId);
      }

      socket.emit('room_left', { roomId });

    } catch (error) {
      console.error('❌ Leave room error:', error);
    }
  }

  // Handle update status
  async handleUpdateStatus(socket, data) {
    try {
      const { status } = data; // 'online', 'away', 'busy', 'offline'
      const userId = socket.userId;

      if (!userId) {
        return;
      }

      await this.chatRepository.updateUserStatus(userId, status);
      // this.broadcastUserStatus(userId, status);

    } catch (error) {
      console.error('❌ Update status error:', error);
    }
  }

  // Handle disconnect
  async handleDisconnect(socket) {
    try {
      const userId = socket.userId;

      if (userId) {
        // Remove from active users
        this.activeUsers.delete(userId);

        // Clean up typing indicators
        const typingKeys = Array.from(this.typingUsers.keys()).filter(key => 
          key.startsWith(`${userId}-`)
        );
        typingKeys.forEach(key => this.typingUsers.delete(key));

        // Clean up user rooms
        this.userRooms.delete(userId);

        // Update user offline status
        await this.chatRepository.updateUserOnlineStatus(userId, false);
        // this.broadcastUserStatus(userId, 'offline');

        console.log(`🔴 User ${userId} disconnected`);
      }

    } catch (error) {
      console.error('❌ Disconnect error:', error);
    }
  }

  // Broadcast user status to contacts
  async broadcastUserStatus(userId, status) {
    try {
      const contacts = await this.chatRepository.getUserContacts(userId);
      
      contacts.forEach(contactId => {
        const contactSocketId = this.activeUsers.get(contactId);
        if (contactSocketId) {
          this.io.to(contactSocketId).emit('user_status_changed', {
            userId,
            status,
            timestamp: new Date()
          });
        }
      });

    } catch (error) {
      console.error('❌ Broadcast user status error:', error);
    }
  }

  // Update recent chats for multiple users
  async updateRecentChats(userIds) {
    try {
      for (const userId of userIds) {
        const userSocketId = this.activeUsers.get(userId);
        if (userSocketId) {
          const recentChats = await ChatService.getRecentChats(userId);
          this.io.to(userSocketId).emit('recent_chats_updated', { recentChats });
        }
      }
    } catch (error) {
      console.error('❌ Update recent chats error:', error);
    }
  }

  // Send notification to user
  async sendNotificationToUser(userId, notification) {
    try {
      const userSocketId = this.activeUsers.get(userId);
      if (userSocketId) {
        this.io.to(userSocketId).emit('notification', notification);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Send notification error:', error);
      return false;
    }
  }

  // Utility methods
  getOnlineUsersCount() {
    return this.activeUsers.size;
  }

  isUserOnline(userId) {
    return this.activeUsers.has(userId);
  }

  getActiveUsers() {
    return Array.from(this.activeUsers.keys());
  }

  // Clean up inactive typing indicators
  cleanupTypingIndicators() {
    const now = Date.now();
    const expiredKeys = [];
    
    this.typingUsers.forEach((timestamp, key) => {
      if (now - timestamp > 5000) { // 5 seconds timeout
        expiredKeys.push(key);
      }
    });
    
    expiredKeys.forEach(key => {
      this.typingUsers.delete(key);
      const [senderId, receiverId] = key.split('-');
      const receiverSocketId = this.activeUsers.get(receiverId);
      if (receiverSocketId) {
        this.io.to(receiverSocketId).emit('user_typing', {
          senderId,
          isTyping: false
        });
      }
    });
  }

  // Start cleanup interval for typing indicators
  startCleanupInterval() {
    setInterval(() => {
      this.cleanupTypingIndicators();
    }, 5000); // Clean up every 5 seconds
  }
}

module.exports = ChatSocketService;