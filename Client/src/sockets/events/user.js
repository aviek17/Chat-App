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

    static onNewUserOnline(callback){
        socketManager.on('new_user_online', callback);
    }

     static offNewUserOnline(callback){
        socketManager.off('new_user_online', callback);
    }

    static onUserOffline(callback){
        socketManager.on('user_went_offline', callback);
    }

    static offUserOffline(callback){
        socketManager.off('user_went_offline', callback);
    }

    static getFriendList(){
        socketManager.emit('user_friends_list');
    }

    static getCurrentActiveFriends(callback){
        socketManager.on(
            'current_online_friends',
            callback
        )
    }

    static removeCurrentActiveFriends(callback){
        socketManager.off(
            'current_online_friends',
            callback
        )
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