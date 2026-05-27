const logger = require("../utils/logger");
const SocketConnectionManager = require("../sockets/SocketConnectionManager");


let connectionManager = null;

module.exports = function (io) {

  if (!connectionManager) {
    connectionManager = new SocketConnectionManager(io);
    connectionManager.start();
    logger.success('SocketConnectionManager initialized');
  }


  io.on('connection', (socket) => {
    try {
      connectionManager.initializeConnection(socket);
    } catch (err) {
      logger.error('Connection initialization error:', err);
    }
  });
};

module.exports.getChatSocketService     = () => connectionManager?.getChatSocketService();
module.exports.getUserSocketService = () => connectionManager?.getUserSocketService();
