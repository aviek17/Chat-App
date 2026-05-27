const UserRepo = require('../../repo/UserRepo');
const log = require('../../utils/logger');

class UserSocketService {
  constructor(io, { activeUsers } = {}) {
    this.io = io;
    this.userRepo = UserRepo;
    this.activeUsers = activeUsers ?? new Map();
  }

  start() {
    log.success('UserSocketService started');
  }

  async handleUserOnline(socket, data) {
    try {
      const { userId } = data;

      if (!userId) {
        socket.emit('error', { message: 'User ID required' });
        return;
      }

      this.activeUsers.set(userId, socket.id);
      socket.userId = userId;

      log.success(`User ${userId} is now online — socket ${socket.id}`);

      // Notify contacts that this user came online
      await this._broadcastPresence(userId, 'online');

    } catch (error) {
      log.error('UserSocketService - handleUserOnline error:', error);
      socket.emit('error', { message: 'Failed to mark user as online' });
    }
  }

  async handleUserOffline(socket) {
    try {
      const userId = socket.userId;
      if (!userId) return;

      this.activeUsers.delete(userId);

      log.info(`User ${userId} went offline`);

      await this._broadcastPresence(userId, 'offline');

    } catch (error) {
      log.error('UserSocketService - handleUserOffline error:', error);
    }
  }

  async handleDisconnect(socket) {
    try {
      const userId = socket.userId;
      if (!userId) return;

      this.activeUsers.delete(userId);

      log.info(`User ${userId} disconnected — socket ${socket.id}`);

      await this._broadcastPresence(userId, 'offline');

    } catch (error) {
      log.error('UserSocketService - handleDisconnect error:', error);
    }
  }


  // ─── Profile ─────────────────────────────────────────────────────────────────

  async handleGetUserProfile(socket, data) {
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

      const isOnline = this.activeUsers.has(userId);

      socket.emit('user_profile', {
        userId,
        isOnline,
        timestamp: Date.now()
      });

    } catch (error) {
      log.error('UserSocketService - handleGetUserProfile error:', error);
      socket.emit('error', { message: 'Failed to get user profile' });
    }
  }

  async handleUpdateStatus(socket, data) {
    try {
      const { status } = data;   // 'online' | 'away' | 'busy' | 'offline'
      const userId = socket.userId;

      if (!userId) {
        socket.emit('error', { message: 'Not authenticated' });
        return;
      }

      const allowedStatuses = ['online', 'away', 'busy', 'offline'];
      if (!allowedStatuses.includes(status)) {
        socket.emit('error', { message: 'Invalid status value' });
        return;
      }

      await this._broadcastPresence(userId, status);

      socket.emit('status_updated', { status, timestamp: Date.now() });

    } catch (error) {
      log.error('UserSocketService - handleUpdateStatus error:', error);
      socket.emit('error', { message: 'Failed to update status' });
    }
  }


  // ─── Contact request real-time notifications ──────────────────────────────────

  async handleContactRequestAccepted(socket, data) {
    try {
      const { contactUserId } = data;
      const userId = socket.userId;

      if (!userId || !contactUserId) {
        socket.emit('error', { message: 'Invalid request data' });
        return;
      }

      // Notify the original requester their request was accepted
      const requesterSocketId = this.activeUsers.get(contactUserId);
      if (requesterSocketId) {
        this.io.to(requesterSocketId).emit('contact_request_was_accepted', {
          acceptedBy: userId,
          timestamp: Date.now()
        });
      }

    } catch (error) {
      log.error('UserSocketService - handleContactRequestAccepted error:', error);
      socket.emit('error', { message: 'Failed to notify contact acceptance' });
    }
  }

  async handleRequestAccepted(acceptorUserInfo, senderUserId) {
    try {
      const userSocketId = this.activeUsers.get(senderUserId);

      console.log("Notifying user", senderUserId, "about acceptance. Socket ID:", userSocketId);

      if (userSocketId) {
        this.io.to(userSocketId).emit('contact_request_accepted', {
          contact: {
            requestFrom: acceptorUserInfo?.displayName
          },
          timestamp: Date.now(),
          message: `Request accepted by ${acceptorUserInfo?.displayName}`
        });
      }
    } catch (err) {
      log.error('UserSocketService - handleRequestAccepted error:', err);
    }

  }

  async handleRequestRejected(rejectorUserInfo, senderUserId) {
    try {
      const userSocketId = this.activeUsers.get(senderUserId);

      if (userSocketId) {
        this.io.to(userSocketId).emit('contact_request_rejected', {
          contact: {
            requestFrom: rejectorUserInfo?.displayName
          },
          timestamp: Date.now(),
          message: `Request rejected by ${rejectorUserInfo?.displayName}`
        });
      }
    } catch (err) {
      log.error('UserSocketService - handleRequestRejected error:', err);
    }

  }


  async handleContactRequestRejected(socket, data) {
    try {
      const { contactUserId } = data;
      const userId = socket.userId;

      if (!userId || !contactUserId) {
        socket.emit('error', { message: 'Invalid request data' });
        return;
      }

      // Notify the original requester their request was rejected
      const requesterSocketId = this.activeUsers.get(contactUserId);
      if (requesterSocketId) {
        this.io.to(requesterSocketId).emit('contact_request_was_rejected', {
          rejectedBy: userId,
          timestamp: Date.now()
        });
      }

    } catch (error) {
      log.error('UserSocketService - handleContactRequestRejected error:', error);
      socket.emit('error', { message: 'Failed to notify contact rejection' });
    }
  }


  // ─── Online status queries ────────────────────────────────────────────────────

  async handleGetOnlineContacts(socket) {
    try {
      const userId = socket.userId;

      if (!userId) {
        socket.emit('error', { message: 'Not authenticated' });
        return;
      }

      const contacts = await UserRepo.getAllContacts(userId);

      const onlineContacts = contacts
        .filter(c => this.activeUsers.has(c.user?.id?.toString()))
        .map(c => ({
          userId: c.user.id,
          uid: c.user.uid,
          displayName: c.user.displayName,
        }));

      socket.emit('online_contacts', {
        contacts: onlineContacts,
        count: onlineContacts.length,
        timestamp: Date.now()
      });

    } catch (error) {
      log.error('UserSocketService - handleGetOnlineContacts error:', error);
      socket.emit('error', { message: 'Failed to get online contacts' });
    }
  }


  // ─── Utilities ────────────────────────────────────────────────────────────────

  isUserOnline(userId) {
    return this.activeUsers.has(userId);
  }

  getUserSocketId(userId) {
    return this.activeUsers.get(userId);
  }

  getOnlineUsersCount() {
    return this.activeUsers.size;
  }

  // Emit presence event to all online contacts of userId
  async _broadcastPresence(userId, status) {
    try {
      const contacts = await UserRepo.getAllContacts(userId);

      contacts.forEach(contact => {
        const contactSocketId = this.activeUsers.get(
          contact.user?.id?.toString()
        );
        if (contactSocketId) {
          this.io.to(contactSocketId).emit('user_status_changed', {
            userId,
            status,
            timestamp: Date.now()
          });
        }
      });

    } catch (error) {
      log.error('UserSocketService - _broadcastPresence error:', error);
    }
  }


}

module.exports = UserSocketService;