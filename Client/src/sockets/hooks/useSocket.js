import { useState, useEffect } from 'react';
import socketManager from '../SocketManager';

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const [connectionError, setConnectionError] = useState(null);

  const token = localStorage.getItem('token'); 

  useEffect(() => {
    
    const initializeSocket = async () => {
      try {
        let socketInstance;
        if(token){
          socketInstance = await socketManager.connectWithToken(token);
        }else{
          socketInstance = await socketManager.connect();
        }
        setSocket(socketInstance);
        setIsConnected(true);
        setConnectionError(null);
      } catch (error) {
        setConnectionError(error);
        setIsConnected(false);
      }
    };

    initializeSocket();

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

    const currentSocket = socketManager.getSocket();
    if (currentSocket) {
      currentSocket.on('connect', handleConnect);
      currentSocket.on('disconnect', handleDisconnect);
      currentSocket.on('error', handleError);
    }

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