import socketManager from '../SocketManager';

export class AuthEvents {
  static authenticate(userData) {
    console.log("Authenticating user:", userData);
    socketManager.emit('authenticate', userData);
  }


  static onAuthenticationSuccess(callback) {
    socketManager.on('authenticate', callback);
  }

  static onAuthenticationError(callback) {
    socketManager.on('authentication_error', callback);
  }


  static removeAuthListeners() {
    socketManager.off('authentication_success');
    socketManager.off('authentication_error');
  }
}