const ChatSocketService = require('./service/ChatSocketService');
const UserSocketService = require('./service/UserSocketService');
const ChatSocketController = require('./controllers/ChatSocketController');
const UserSocketController = require('./controllers/UserSocketController');
const log = require('../utils/logger');



class SocketConnectionManager {
    constructor(io) {
        this.io = io;
        this.activeUsers = new Map();
        this.typingUsers = new Map();
        // this.userRooms = new Map();   


        this.chatSocketService = new ChatSocketService(io, {
            activeUsers: this.activeUsers,
            typingUsers: this.typingUsers,
            userRooms: this.userRooms,
        });

        this.userSocketService = new UserSocketService(io, {
            activeUsers: this.activeUsers,
        });

    }

    start() {
        this.chatSocketService.start();
        this.userSocketService.start();
        log.success('SocketConnectionManager started');
    }

    initializeConnection(socket) {
        log.success(`New client connected: ${socket.id}`);

        this._wireChatEvents(socket);
        this._wireUserEvents(socket);
        this._wireDisconnect(socket);

    }

    _wireChatEvents(socket) {
        try {
            const controller = new ChatSocketController(this.chatSocketService);
            controller.initializeEventHandlers(socket);
            log.info('Chat events wired');
        } catch (err) {
            log.error('Failed to wire chat events:', err);
        }
    }

    _wireUserEvents(socket) {
        try {
            const controller = new UserSocketController(this.userSocketService);
            controller.initializeEventHandlers(socket);
            log.info('User events wired');
        } catch (err) {
            log.error('Failed to wire user events:', err);
        }
    }


    _wireDisconnect(socket) {
        socket.on('disconnect', async () => {
            log.info(`Client disconnected: ${socket.id}`);
            try {
                await this.chatSocketService.handleDisconnect(socket);
                await this.userSocketService.handleDisconnect(socket);
            } catch (err) {
                log.error('Disconnect handler error:', err);
            }
        });
    }


    getChatSocketService() { return this.chatSocketService; }
    getUserSocketService() { return this.userSocketService; }

}


module.exports = SocketConnectionManager;