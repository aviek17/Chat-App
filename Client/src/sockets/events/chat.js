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

    static onNewUserMessageStatusUpdateDelivered(callback) {
        socketManager.on('user_update_message_status_delivered', callback);
    }

    static offNewUserMessageStatusUpdateDelivered(callback) {
        socketManager.off('user_update_message_status_delivered', callback);
    }

    static onMsgReadStatusUpdate(data) {
        socketManager.emit('message_read', data);
    }


    static removeChatListeners() {
        socketManager.off('user_online_status');
        socketManager.off('chat_history');
    }
}


