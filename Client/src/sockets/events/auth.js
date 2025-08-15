import socketManager from '../SocketManager';

export class AuthEvents {
  static isAuthenticated = false;

  static authenticate(userData) {
    socketManager.emit('authenticate', userData);
  }

  // Match your server's event names
  static onAuthenticationSuccess(callback) {
    socketManager.on('authenticate', (data) => {
      this.isAuthenticated = true;
      callback(data);
    });
  }

  static onAuthenticationError(callback) {
    socketManager.on('auth_error', (error) => {
      this.isAuthenticated = false;
      callback(error);
    });
  }

  // Also listen for general error events
  static onGeneralError(callback) {
    socketManager.on('error', (error) => {
      this.isAuthenticated = false; // Reset auth on any error
      callback(error);
    });
  }

  static removeAuthListeners() {
    console.log("Removing auth listeners");
    socketManager.off('authenticate');
    socketManager.off('auth_error');
    socketManager.off('error');
  }

  static getAuthStatus() {
    return this.isAuthenticated;
  }

  static resetAuthStatus() {
    this.isAuthenticated = false;
  }

  static logout() {
    console.log("Logging out user");
    this.removeAuthListeners();
    this.resetAuthStatus();
    socketManager.disconnect(); 
  }
}