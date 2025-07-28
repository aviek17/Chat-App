import { useEffect, useRef, useCallback, useState } from 'react';
import socketManager from '../SocketManager';

export const useSocket = (serverUrl = import.meta.env.VITE_CHAT_APP_HOST, options = {}) => {
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        socketRef.current = socketManager.connect(serverUrl, options);

        const handleConnect = () => {
            setIsConnected(true);
        };

        const handleDisconnect = () => {
            setIsConnected(false);
        };

        socketManager.on('connect', handleConnect);
        socketManager.on('disconnect', handleDisconnect);

        return () => {
            socketManager.off('connect', handleConnect);
            socketManager.off('disconnect', handleDisconnect);
            socketManager.disconnect();
        };
    }, [serverUrl]);

    const emit = useCallback((event, data) => {
        socketManager.emit(event, data);
    }, []);

    const on = useCallback((event, handler) => {
        socketManager.on(event, handler);
    }, []);

    const off = useCallback((event, handler) => {
        socketManager.off(event, handler);
    }, []);

    return {
        socket: socketRef.current,
        isConnected,
        emit,
        on,
        off
    };
};