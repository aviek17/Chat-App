import socketManager from '../SocketManager';

export class MessageEvents {
    
    static sendMessage(messageData) {
        socketManager.emit('send_message', messageData);
    }

    static onMessageSent(callback) {
        socketManager.on('message_sent', callback);
    }

    static sendMessageWithAttachment(messageData) {
        socketManager.emit('send_message_with_attachment', messageData);
    }

    static deleteMessage(messageId) {
        socketManager.emit('delete_message', { messageId });
    }

    static deleteAttachment(attachmentId) {
        socketManager.emit('delete_attachment', { attachmentId });
    }

    static markMessageDelivered(messageId) {
        socketManager.emit('message_delivered', { messageId });
    }

    static markMessageRead(messageId) {
        socketManager.emit('message_read', { messageId });
    }

    static onNewMessage(callback) {
        socketManager.on('message_received', callback);
    }

    static offNewMessage(callback) {
        socketManager.off('message_received', callback);
    }

    static onMessageDelivered(callback) {
        socketManager.on('message_delivered_update', callback);
    }

    static onMessageRead(callback) {
        socketManager.on('message_read_update', callback);
    }

    static onMessageDeleted(callback) {
        socketManager.on('message_deleted', callback);
    }

    static removeMessageListeners() {
        socketManager.off('new_message');
        socketManager.off('message_delivered_update');
        socketManager.off('message_read_update');
        socketManager.off('message_deleted');
    }
}
