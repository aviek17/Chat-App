const logger = require("../utils/logger");
const ChatSocketService = require("../sockets/service/ChatSocketService");


let chatSocketService = null;

module.exports = function (io) {

  // Initialize ChatSocketService once when the module is loaded
  if (!chatSocketService) {
    chatSocketService = new ChatSocketService(io);

    // Start cleanup interval for typing indicators
    chatSocketService.startCleanupInterval();

    logger.success('ChatSocketService initialized');
  }


  io.on('connection', (socket) => {
    logger.success('New client connected:', socket.id);

    // chat controllers
    try{
      chatSocketService.initializeConnection(socket);
      logger.info("Chat Socket connected successfully");
    }catch(err){
      logger.error("Error initializing chat socket connection:", err);
    }



    socket.on('disconnect', () => {
      logger.error('Client disconnected:', socket.id);
    });
  });
};
