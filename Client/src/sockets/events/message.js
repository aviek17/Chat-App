import socketManager from '../SocketManager';

export class MessageEvents {
    // Send message
    static sendMessage(messageData) {
        console.log(messageData)
        socketManager.emit('send_message', messageData);
    }

    static onMessageSent(callback) {
        socketManager.on('message_sent', callback);
    }

    // Send message with attachment
    static sendMessageWithAttachment(messageData) {
        socketManager.emit('send_message_with_attachment', messageData);
    }

    // Delete message
    static deleteMessage(messageId) {
        socketManager.emit('delete_message', { messageId });
    }

    // Delete attachment
    static deleteAttachment(attachmentId) {
        socketManager.emit('delete_attachment', { attachmentId });
    }

    // Mark message as delivered
    static markMessageDelivered(messageId) {
        socketManager.emit('message_delivered', { messageId });
    }

    // Mark message as read
    static markMessageRead(messageId) {
        socketManager.emit('message_read', { messageId });
    }

    // Listen for incoming messages
    static onNewMessage(callback) {
        console.log("🔄 Registering new message listener");
        socketManager.on('message_received', callback);
    }

    static offNewMessage(callback) {
        socketManager.off('message_received', callback);
    }

    // Listen for message status updates
    static onMessageDelivered(callback) {
        socketManager.on('message_delivered_update', callback);
    }

    static onMessageRead(callback) {
        socketManager.on('message_read_update', callback);
    }

    static onMessageDeleted(callback) {
        socketManager.on('message_deleted', callback);
    }

    // Remove message listeners
    static removeMessageListeners() {
        socketManager.off('new_message');
        socketManager.off('message_delivered_update');
        socketManager.off('message_read_update');
        socketManager.off('message_deleted');
    }
}
