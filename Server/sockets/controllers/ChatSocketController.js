class ChatSocketController {
  constructor(chatSocketService) {
    this.chatSocketService = chatSocketService;
  }

  // Initialize all event handlers for a socket connection
  initializeEventHandlers(socket) {

    // Authentication event
    socket.on('authenticate', (data) => this.handleAuthenticate(socket, data));
    
    // Message events
    socket.on('send_message', (data) => this.handleSendMessage(socket, data));
    socket.on('send_message_with_attachment', (data) => this.handleSendMessageWithAttachment(socket, data));
    socket.on('message_delivered', (data) => this.handleMessageDelivered(socket, data));
    socket.on('message_read', (data) => this.handleMessageRead(socket, data));
    socket.on('delete_message', (data) => this.handleDeleteMessage(socket, data));
    socket.on('delete_attachment', (data) => this.handleDeleteAttachment(socket, data));
    
    // Chat history and data events
    socket.on('get_chat_history', (data) => this.handleGetChatHistory(socket, data));
    socket.on('get_recent_chats', (data) => this.handleGetRecentChats(socket, data));
    socket.on('get_unread_count', (data) => this.handleGetUnreadCount(socket, data));
    socket.on('get_unread_count_by_partner', (data) => this.handleGetUnreadCountByPartner(socket, data));
    socket.on('get_messages_count', (data) => this.handleGetMessagesCount(socket, data));
    socket.on('get_messages_by_status', (data) => this.handleGetMessagesByStatus(socket, data));
    
    // Search events
    socket.on('search_messages', (data) => this.handleSearchMessages(socket, data));
    
    // Attachment events
    //socket.on('get_chat_attachments', (data) => this.handleGetChatAttachments(socket, data));
    //socket.on('get_chat_attachment_stats', (data) => this.handleGetChatAttachmentStats(socket, data));
    
    // Typing events
    socket.on('typing_start', (data) => this.handleTypingStart(socket, data));
    socket.on('typing_stop', (data) => this.handleTypingStop(socket, data));
    
    // Room events (for group chats)
    socket.on('join_room', (data) => this.handleJoinRoom(socket, data));
    socket.on('leave_room', (data) => this.handleLeaveRoom(socket, data));
    
    // Status events
    socket.on('update_status', (data) => this.handleUpdateStatus(socket, data));
    
    // Connection events
    socket.on('disconnect', () => this.handleDisconnect(socket));
    
    // Error handling
    socket.on('error', (error) => this.handleSocketError(socket, error));
    
    // Heartbeat/ping events for connection health
    socket.on('ping', () => this.handlePing(socket));
    
    // Additional utility events
    socket.on('get_online_users', () => this.handleGetOnlineUsers(socket));
    socket.on('check_user_online', (data) => this.handleCheckUserOnline(socket, data));
  }

  //User added to Active user list
  async handleAuthenticate(socket, data) {
    try{
      await this.chatSocketService.addCurrentUserToOnlineUsersList(socket, data);
    }catch(err){
      console.error('Controller - Authentication error:', err);
      socket.emit('error', { message: 'Authentication failed' });
    }
  }

  // Message handlers
  async handleSendMessage(socket, data) {
    try {
      await this.chatSocketService.handleSendMessage(socket, data);
    } catch (error) {
      console.error('Controller - Send message error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  }

  async handleSendMessageWithAttachment(socket, data) {
    try {
      await this.chatSocketService.handleSendMessageWithAttachment(socket, data);
    } catch (error) {
      console.error('Controller - Send message with attachment error:', error);
      socket.emit('error', { message: 'Failed to send message with attachment' });
    }
  }

  async handleMessageDelivered(socket, data) {
    try {
      await this.chatSocketService.handleMessageDelivered(socket, data);
    } catch (error) {
      console.error('Controller - Message delivered error:', error);
    }
  }

  async handleMessageRead(socket, data) {
    try {
      await this.chatSocketService.handleMessageRead(socket, data);
    } catch (error) {
      console.error('Controller - Message read error:', error);
    }
  }

  async handleDeleteMessage(socket, data) {
    try {
      await this.chatSocketService.handleDeleteMessage(socket, data);
    } catch (error) {
      console.error('Controller - Delete message error:', error);
      socket.emit('error', { message: 'Failed to delete message' });
    }
  }

  async handleDeleteAttachment(socket, data) {
    try {
      await this.chatSocketService.handleDeleteAttachment(socket, data);
    } catch (error) {
      console.error('Controller - Delete attachment error:', error);
      socket.emit('error', { message: 'Failed to delete attachment' });
    }
  }

  // Chat history and data handlers
  async handleGetChatHistory(socket, data) {
    try {
      await this.chatSocketService.handleGetChatHistory(socket, data);
    } catch (error) {
      console.error('Controller - Get chat history error:', error);
      socket.emit('error', { message: 'Failed to get chat history' });
    }
  }

  async handleGetRecentChats(socket, data) {
    try {
      await this.chatSocketService.handleGetRecentChats(socket, data);
    } catch (error) {
      console.error('Controller - Get recent chats error:', error);
      socket.emit('error', { message: 'Failed to get recent chats' });
    }
  }

  async handleGetUnreadCount(socket, data) {
    try {
      await this.chatSocketService.handleGetUnreadCount(socket, data);
    } catch (error) {
      console.error('Controller - Get unread count error:', error);
      socket.emit('error', { message: 'Failed to get unread count' });
    }
  }

  async handleGetUnreadCountByPartner(socket, data) {
    try {
      await this.chatSocketService.handleGetUnreadCountByPartner(socket, data);
    } catch (error) {
      console.error('Controller - Get unread count by partner error:', error);
      socket.emit('error', { message: 'Failed to get unread count by partner' });
    }
  }

  async handleGetMessagesCount(socket, data) {
    try {
      await this.chatSocketService.handleGetMessagesCount(socket, data);
    } catch (error) {
      console.error('Controller - Get messages count error:', error);
      socket.emit('error', { message: 'Failed to get messages count' });
    }
  }

  async handleGetMessagesByStatus(socket, data) {
    try {
      await this.chatSocketService.handleGetMessagesByStatus(socket, data);
    } catch (error) {
      console.error('Controller - Get messages by status error:', error);
      socket.emit('error', { message: 'Failed to get messages by status' });
    }
  }

  // Search handler
  async handleSearchMessages(socket, data) {
    try {
      await this.chatSocketService.handleSearchMessages(socket, data);
    } catch (error) {
      console.error('Controller - Search messages error:', error);
      socket.emit('error', { message: 'Failed to search messages' });
    }
  }

  // Attachment handlers
  async handleGetChatAttachments(socket, data) {
    try {
      await this.chatSocketService.handleGetChatAttachments(socket, data);
    } catch (error) {
      console.error('Controller - Get chat attachments error:', error);
      socket.emit('error', { message: 'Failed to get chat attachments' });
    }
  }

  async handleGetChatAttachmentStats(socket, data) {
    try {
      await this.chatSocketService.handleGetChatAttachmentStats(socket, data);
    } catch (error) {
      console.error('Controller - Get chat attachment stats error:', error);
      socket.emit('error', { message: 'Failed to get attachment stats' });
    }
  }

  // Typing handlers
  handleTypingStart(socket, data) {
    try {
      this.chatSocketService.handleTypingStart(socket, data);
    } catch (error) {
      console.error('Controller - Typing start error:', error);
    }
  }

  handleTypingStop(socket, data) {
    try {
      this.chatSocketService.handleTypingStop(socket, data);
    } catch (error) {
      console.error('Controller - Typing stop error:', error);
    }
  }

  // Room handlers
  async handleJoinRoom(socket, data) {
    try {
      await this.chatSocketService.handleJoinRoom(socket, data);
    } catch (error) {
      console.error('Controller - Join room error:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  }

  async handleLeaveRoom(socket, data) {
    try {
      await this.chatSocketService.handleLeaveRoom(socket, data);
    } catch (error) {
      console.error('Controller - Leave room error:', error);
    }
  }

  // Status handler
  async handleUpdateStatus(socket, data) {
    try {
      await this.chatSocketService.handleUpdateStatus(socket, data);
    } catch (error) {
      console.error('Controller - Update status error:', error);
    }
  }

  // Connection handlers
  async handleDisconnect(socket) {
    try {
      await this.chatSocketService.handleDisconnect(socket);
    } catch (error) {
      console.error('Controller - Disconnect error:', error);
    }
  }

  handleSocketError(socket, error) {
    console.error('Controller - Socket error:', error);
    socket.emit('error', { message: 'Socket error occurred' });
  }

  // Heartbeat handler
  handlePing(socket) {
    try {
      socket.emit('pong', { timestamp: Date.now() });
    } catch (error) {
      console.error('Controller - Ping error:', error);
    }
  }

  // Utility handlers
  handleGetOnlineUsers(socket) {
    try {
      const userId = socket.userId;
      
      if (!userId) {
        socket.emit('error', { message: 'Not authenticated' });
        return;
      }

      const onlineUsers = this.chatSocketService.getActiveUsers();
      const onlineUsersCount = this.chatSocketService.getOnlineUsersCount();
      
      socket.emit('online_users', {
        users: onlineUsers,
        count: onlineUsersCount
      });
    } catch (error) {
      console.error('Controller - Get online users error:', error);
      socket.emit('error', { message: 'Failed to get online users' });
    }
  }

  handleCheckUserOnline(socket, data) {
    try {
      const { userId } = data;
      const requesterId = socket.userId;
      
      if (!requesterId) {
        socket.emit('error', { message: 'Not authenticated' });
        return;
      }

      if (!userId) {
        socket.emit('error', { message: 'User ID required' });
        return;
      }

      const isOnline = this.chatSocketService.isUserOnline(userId);
      
      socket.emit('user_online_status', {
        userId,
        isOnline,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Controller - Check user online error:', error);
      socket.emit('error', { message: 'Failed to check user online status' });
    }
  }

  // Rate limiting helper (optional)
  checkRateLimit(socket, eventType) {
    const now = Date.now();
    const userId = socket.userId;
    
    if (!userId) return false;
    
    // Initialize rate limit tracking if not exists
    if (!socket.rateLimits) {
      socket.rateLimits = {};
    }
    
    if (!socket.rateLimits[eventType]) {
      socket.rateLimits[eventType] = { count: 0, lastReset: now };
    }
    
    const limit = socket.rateLimits[eventType];
    
    // Reset counter every minute
    if (now - limit.lastReset > 60000) {
      limit.count = 0;
      limit.lastReset = now;
    }
    
    // Check limits based on event type
    const limits = {
      'send_message': 60,           // 60 messages per minute
      'send_message_with_attachment': 10, // 10 attachments per minute
      'get_chat_history': 20,       // 20 history requests per minute
      'search_messages': 10,        // 10 searches per minute
      'typing_start': 100,          // 100 typing events per minute
      'get_recent_chats': 30        // 30 recent chats requests per minute
    };
    
    const maxRequests = limits[eventType] || 100;
    
    if (limit.count >= maxRequests) {
      socket.emit('rate_limit_exceeded', {
        eventType,
        maxRequests,
        resetTime: limit.lastReset + 60000
      });
      return false;
    }
    
    limit.count++;
    return true;
  }

  // Enhanced message handler with rate limiting
  async handleSendMessageWithRateLimit(socket, data) {
    if (!this.checkRateLimit(socket, 'send_message')) {
      return;
    }
    
    await this.handleSendMessage(socket, data);
  }

  // Enhanced attachment handler with rate limiting
  async handleSendMessageWithAttachmentAndRateLimit(socket, data) {
    if (!this.checkRateLimit(socket, 'send_message_with_attachment')) {
      return;
    }
    
    await this.handleSendMessageWithAttachment(socket, data);
  }

  // Method to get all registered event handlers
  getEventHandlers() {
    return [
      'authenticate',
      'send_message',
      'send_message_with_attachment',
      'message_delivered',
      'message_read',
      'delete_message',
      'delete_attachment',
      'get_chat_history',
      'get_recent_chats',
      'get_unread_count',
      'get_unread_count_by_partner',
      'get_messages_count',
      'get_messages_by_status',
      'search_messages',
      'get_chat_attachments',
      'get_chat_attachment_stats',
      'typing_start',
      'typing_stop',
      'join_room',
      'leave_room',
      'update_status',
      'disconnect',
      'error',
      'ping',
      'get_online_users',
      'check_user_online'
    ];
  }
}

module.exports = ChatSocketController;