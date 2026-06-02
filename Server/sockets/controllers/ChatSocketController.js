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


    //Message read by user
    socket.on('message_read', (data) => this.handleMessageRead(socket, data));

  }

  //User added to Active user list
  async handleAuthenticate(socket, data) {
    try {
      await this.chatSocketService.addCurrentUserToOnlineUsersList(socket, data);
    } catch (err) {
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


  // Message read handler
  async handleMessageRead(socket, data) {
    try{
        await this.chatSocketService.handleMessageRead(socket, data);
    }catch(error){
      log.error('Controller - Message read error:', error);
      socket.emit('error', { message: 'Failed to update message status' });
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


  // Method to get all registered event handlers
  getEventHandlers() {
    return [
      'authenticate',
      'send_message',
    ];
  }
}

module.exports = ChatSocketController;