import socketManager from '../SocketManager';

export class ChatEvents {
    static getChatHistory(userData) {
        socketManager.emit('get_chat_history', userData);
    }

    static getUserOnlineStatus(userId) {
        socketManager.emit('check_user_online', { userId });
    }

    static onReceivingUserStatus(callback) {
        socketManager.on('user_online_status', callback);   
    }

    static offReceivingUserStatus(callback) {
        socketManager.off('user_online_status', callback);
    }

    static onChatHistoryReceived(callback) {
        socketManager.on('chat_history', callback);
    }

    static offChatHistoryReceived(callback) {
        socketManager.off('chat_history', callback);
    }


    static removeChatListeners() {
        socketManager.off('user_online_status');
        socketManager.off('chat_history');
    }
}


