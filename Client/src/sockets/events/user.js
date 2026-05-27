import socketManager from '../SocketManager';

export class UserEvents {
    static onReceivingNewContact(callback) {
        socketManager.on(
            'new_contact_request',
            callback
        );
    }

    static onAcceptingRequest(callback) {
        socketManager.on(
            'contact_request_accepted',
            callback
        );
    }

    static removeAcceptingRequest(callback) {
        socketManager.off(
            'contact_request_accepted',
            callback
        );
    }

    static removeReceivingNewContact(callback) {
        socketManager.off(
            "new_contact_request",
            callback
        );
    }
}