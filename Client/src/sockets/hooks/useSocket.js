import { useState, useEffect } from 'react';
import socketManager from '../SocketManager';

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const [connectionError, setConnectionError] = useState(null);

  useEffect(() => {
    
    const initializeSocket = async () => {
      try {
        const socketInstance = await socketManager.connect();
        setSocket(socketInstance);
        setIsConnected(true);
        setConnectionError(null);
      } catch (error) {
        setConnectionError(error);
        setIsConnected(false);
      }
    };

    initializeSocket();

    // Set up listeners for connection state changes
    const handleConnect = () => {
      setIsConnected(true);
      setConnectionError(null);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleError = (error) => {
      setConnectionError(error);
    };

    // Add listeners if socket exists
    const currentSocket = socketManager.getSocket();
    if (currentSocket) {
      currentSocket.on('connect', handleConnect);
      currentSocket.on('disconnect', handleDisconnect);
      currentSocket.on('error', handleError);
    }

    // Cleanup
    return () => {
      const currentSocket = socketManager.getSocket();
      if (currentSocket) {
        currentSocket.off('connect', handleConnect);
        currentSocket.off('disconnect', handleDisconnect);
        currentSocket.off('error', handleError);
      }
    };
  }, []);

  return {
    isConnected,
    socket,
    connectionError,
    socketManager,
    getDebugInfo: () => socketManager.getConnectionState()
  };
};