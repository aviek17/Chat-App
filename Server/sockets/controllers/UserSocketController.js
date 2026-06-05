class UserSocketController {
  constructor(userSocketService) {
    this.userSocketService = userSocketService;
  }

  // Initialize all user-related event handlers for a socket connection
  initializeEventHandlers(socket) {

    // Profile events
    socket.on('get_user_profile', (data) => this.handleGetUserProfile(socket, data));
    socket.on('update_status',    (data) => this.handleUpdateStatus(socket, data));

    // Contact request events (real-time push layer — HTTP does the write)
    socket.on('contact_request_accepted', (data) => this.handleContactRequestAccepted(socket, data));
    socket.on('contact_request_rejected', (data) => this.handleContactRequestRejected(socket, data));

    // Online status query
    socket.on('check_user_online',  (data) => this.handleCheckUserOnline(socket, data));
    socket.on('get_online_contacts', ()    => this.handleGetOnlineContacts(socket));


    // Users Online friend List
    socket.on('user_friends_list', () => this.handleGetUserFriendsList(socket));

    // Connection events
    // socket.on('disconnect', () => this.handleDisconnect(socket));
    socket.on('error',      (error) => this.handleSocketError(socket, error));
    socket.on('ping',       () => this.handlePing(socket));
  }


  // ─── Profile ─────────────────────────────────────────────────────────────────

  async handleGetUserProfile(socket, data) {
    try {
      await this.userSocketService.handleGetUserProfile(socket, data);
    } catch (error) {
      console.error('UserSocketController - Get user profile error:', error);
      socket.emit('error', { message: 'Failed to get user profile' });
    }
  }

  async handleUpdateStatus(socket, data) {
    try {
      await this.userSocketService.handleUpdateStatus(socket, data);
    } catch (error) {
      console.error('UserSocketController - Update status error:', error);
      socket.emit('error', { message: 'Failed to update status' });
    }
  }

  // Users Online friend list
  async handleGetUserFriendsList(socket){
    try{
      await this.userSocketService.handleUserOnlineFriendList(socket);
    }catch(err){
      console.error('UserSocketController - Update user friend list:', error);
      socket.emit('error', { message: 'Failed to send users friend list' });
    }
  }


  // ─── Contact request real-time notifications ──────────────────────────────────

  async handleContactRequestAccepted(socket, data) {
    try {
      await this.userSocketService.handleContactRequestAccepted(socket, data);
    } catch (error) {
      console.error('UserSocketController - Contact request accepted error:', error);
      socket.emit('error', { message: 'Failed to process acceptance' });
    }
  }

  async handleContactRequestRejected(socket, data) {
    try {
      await this.userSocketService.handleContactRequestRejected(socket, data);
    } catch (error) {
      console.error('UserSocketController - Contact request rejected error:', error);
      socket.emit('error', { message: 'Failed to process rejection' });
    }
  }


  // ─── Online status queries ────────────────────────────────────────────────────

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

      const isOnline = this.userSocketService.isUserOnline(userId);
      socket.emit('user_online_status', {
        userId,
        isOnline,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('UserSocketController - Check user online error:', error);
      socket.emit('error', { message: 'Failed to check online status' });
    }
  }

  async handleGetOnlineContacts(socket) {
    try {
      await this.userSocketService.handleGetOnlineContacts(socket);
    } catch (error) {
      console.error('UserSocketController - Get online contacts error:', error);
      socket.emit('error', { message: 'Failed to get online contacts' });
    }
  }


  // ─── Connection ───────────────────────────────────────────────────────────────

  // async handleDisconnect(socket) {
  //   try {
  //     await this.userSocketService.handleDisconnect(socket);
  //   } catch (error) {
  //     console.error('UserSocketController - Disconnect error:', error);
  //   }
  // }

  handleSocketError(socket, error) {
    console.error('UserSocketController - Socket error:', error);
    socket.emit('error', { message: 'Socket error occurred' });
  }

  handlePing(socket) {
    try {
      socket.emit('pong', { timestamp: Date.now() });
    } catch (error) {
      console.error('UserSocketController - Ping error:', error);
    }
  }


  getEventHandlers() {
    return [
      'get_user_profile',
      'update_status',
      'contact_request_accepted',
      'contact_request_rejected',
      'check_user_online',
      'get_online_contacts',
      'disconnect',
      'error',
      'ping',
    ];
  }
}

module.exports = UserSocketController;