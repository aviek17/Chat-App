import { io } from 'socket.io-client';

class SocketManager {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.eventHandlers = new Map();
  }

  connect(serverUrl = import.meta.env.VITE_CHAT_APP_HOST, options = {}) {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io(serverUrl, {
      autoConnect: false,
      path: import.meta.env.VITE_CHAT_APP_SOCKET_PATH,
      transports: ['polling', 'websocket'],
      ...options
    });

    this.setupConnectionListeners();
    this.socket.connect();

    return this.socket;
  }

  setupConnectionListeners() {
    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      this.isConnected = true;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.isConnected = false;
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  on(event, handler) {
    if (this.socket) {
      this.socket.on(event, handler);

      if (!this.eventHandlers.has(event)) {
        this.eventHandlers.set(event, []);
      }
      this.eventHandlers.get(event).push(handler);
    }
  }

  off(event, handler) {
    if (this.socket) {
      this.socket.off(event, handler);

      if (this.eventHandlers.has(event)) {
        const handlers = this.eventHandlers.get(event);
        const index = handlers.indexOf(handler);
        if (index !== -1) {
          handlers.splice(index, 1);
        }
      }
    }
  }

  emit(event, data) {
    console.log(data)
    if (this.socket && this.isConnected) {
      console.log(`Emitting event: ${event}`, data);
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected. Cannot emit:', event);
    }
  }

  disconnect() {
    if (this.socket) {
      this.eventHandlers.forEach((handlers, event) => {
        handlers.forEach(handler => {
          this.socket.off(event, handler);
        });
      });
      this.eventHandlers.clear();

      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  getSocket() {
    return this.socket;
  }

  isSocketConnected() {
    return this.isConnected && this.socket?.connected;
  }
}

const socketManager = new SocketManager();
export default socketManager;