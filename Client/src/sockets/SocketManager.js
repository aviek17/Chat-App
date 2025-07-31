import { io } from 'socket.io-client';

class SocketManager {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.eventHandlers = new Map();
    this.connectionPromise = null;
  }

  connect(serverUrl = import.meta.env.VITE_CHAT_APP_HOST, options = {}) {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    // If already connected, return the existing socket
    if (this.socket && this.socket.connected) {
      return Promise.resolve(this.socket);
    }

    // Clean up any existing socket
    if (this.socket) {
      this.disconnect();
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      this.socket = io(serverUrl, {
        autoConnect: true, 
        path: import.meta.env.VITE_CHAT_APP_SOCKET_PATH || '/socket.io/',
        transports: ['websocket', 'polling'],
        timeout: 20000,
        ...options
      });

      this.setupConnectionListeners(resolve, reject);
    });

    // Make socket available globally for debugging
    window.socketManager = this;
    window.socket = this.socket;

    return this.connectionPromise;
  }

  setupConnectionListeners(resolve, reject) {
    const connectTimeout = setTimeout(() => {
      reject(new Error('Connection timeout'));
    }, 20000);

    this.socket.on('connect', () => {
      clearTimeout(connectTimeout);
      this.isConnected = true;
      this.connectionPromise = null; // Reset promise
      resolve(this.socket);
    });

    this.socket.on('connect_error', (error) => {
      clearTimeout(connectTimeout);
      this.isConnected = false;
      this.connectionPromise = null;
      reject(error);
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;

      // Auto-reconnect for certain disconnect reasons
      if (reason === 'io server disconnect') {
        setTimeout(() => this.connect(), 1000);
      }
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Test event for debugging
    this.socket.on('test_response', (data) => {
      console.log('Test response received:', data);
    });
  }

  on(event, handler) {
    if (!this.socket) {
      return;
    }

    this.socket.on(event, handler);

    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event).push(handler);
  }

  off(event, handler) {

    if (!this.socket) {
      return;
    }

    if (handler) {
      this.socket.off(event, handler);

      if (this.eventHandlers.has(event)) {
        const handlers = this.eventHandlers.get(event);
        const index = handlers.indexOf(handler);
        if (index !== -1) {
          handlers.splice(index, 1);
        }
      }
    } else {
      this.socket.off(event);
      this.eventHandlers.delete(event);
    }
  }

  emit(event, data) {
    if (!this.socket) {
      return;
    }

    if (!this.isConnected) {
      return;
    }

    this.socket.emit(event, data);
  }

  disconnect() {
    if (this.socket) {
      // Clean up event handlers
      this.eventHandlers.forEach((handlers, event) => {
        handlers.forEach(handler => {
          this.socket.off(event, handler);
        });
      });
      this.eventHandlers.clear();

      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.connectionPromise = null;
    }
  }

  getSocket() {
    return this.socket;
  }

  isSocketConnected() {
    return this.socket && this.socket.connected && this.isConnected;
  }

  // Debug methods
  getConnectionState() {
    return {
      hasSocket: !!this.socket,
      socketConnected: this.socket?.connected || false,
      isConnectedFlag: this.isConnected,
      socketId: this.socket?.id || 'no socket',
      registeredEvents: Array.from(this.eventHandlers.keys())
    };
  }

  listRegisteredEvents() {
    const state = this.getConnectionState();
    return state;
  }
}

const socketManager = new SocketManager();
export default socketManager;