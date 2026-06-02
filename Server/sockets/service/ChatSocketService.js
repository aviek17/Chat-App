const ChatRepository = require('../../repo/ChatRepo');
const { validateObjectId, validateMessageContent } = require('../../validation/message');
const log = require('../../utils/logger');

class ChatSocketService {
  constructor(io, { activeUsers, typingUsers, userRooms } = {}) {
    this.io = io;
    this.chatRepository = ChatRepository;
    this.activeUsers = activeUsers ?? new Map();
    this.typingUsers = typingUsers ?? new Map();
    // this.userRooms   = userRooms   ?? new Map();
  }


  start() {
    setInterval(() => {
      this.cleanupTypingIndicators();
    }, 5000);
    log.success('ChatSocketService started');
  }

  // Add active user
  addActiveUser(userId, socketId) {
    log.info(`Active user: ${userId} with socket ID: ${socketId}`);
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

      this.activeUsers.set(userId, socket.id);
      socket.userId = userId;

      await this.chatRepository.updateUserOnlineStatus(userId, true);

      socket.emit('authenticate', {
        message: 'Welcome to Talk Sphere',
        recentChats: [],
        userId
      });

      // fetching all friend for userId to emit their online status to userId's friend list
      const friends = await this.chatRepository.getFriendIdList(userId);

      if (!friends.length) return;

      // get all users who has sent messages while user was offline
      const senderIds = await this.chatRepository.getSendersWithPendingMessages(userId);

      const friendIdsSet = new Set(friends);

      senderIds.forEach(senderId => {

        if (!friendIdsSet.has(senderId)) return;

        const senderSocketId = this.activeUsers.get(senderId);
        if (!senderSocketId) return;

        this.io.to(senderSocketId).emit('user_online', { userId, deliveredAt: new Date() });
      })

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

      if (!validatedContent) {
        socket.emit('error', { message: 'Invalid message content' });
        return;
      }

      // Create message using ChatService

      const receiverSocketId = this.activeUsers.get(receiverId);
      const senderSocketId = this.activeUsers.get(senderId);

      const messageData = {
        sender: senderId,
        receiver: receiverId,
        status: receiverSocketId ? 'delivered' : 'sent',
        content
      };

      const message = await this.chatRepository.createMessage(messageData);

      if (message?.messageId) {
        this.io.to(senderSocketId).emit('message_sent_successfully', { status: true, message, senderId, receiverId });
        if (receiverSocketId) {
          this.io.to(receiverSocketId).emit('message_received', { message, senderId, receiverId });
        }
      }

    } catch (error) {
      console.error('❌ Send message error:', error);
      socket.emit('error', { message: error.message || 'Failed to send message' });
    }
  }


  //handle message read by user
  async handleMessageRead(socket, data){
    try{
      const response = await this.chatRepository.markMessagesAsRead(data.senderId, socket.userId);
    }catch(err){
      console.log(err)
      log.error('Message read error from here:', err);
      socket.emit('error', { message: 'Failed to update message status' });
    }
  }

  // Handle new contact
  async handleNewContact(userId, contactData, result) {
    try {
      const userSocketId = this.activeUsers.get(contactData?.contactUserId);
      if (userSocketId) {
        this.io.to(userSocketId).emit('new_contact_request', {
          contact: {
            requestFrom: userId?.displayName
          },
          contactInfo: result,
          timestamp: Date.now()
        });
      }
    } catch (error) {
      console.error('Notify new contact error: ', error);
    }
  }

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
        // this.userRooms.delete(userId);

        // Update user offline status
        await this.chatRepository.updateUserOnlineStatus(userId, false);
        // this.broadcastUserStatus(userId, 'offline');

        console.log(`🔴 User ${userId} disconnected`);
      }

    } catch (error) {
      console.error('❌ Disconnect error:', error);
    }
  }

  isUserOnline({ userId }) {
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


}

module.exports = ChatSocketService;