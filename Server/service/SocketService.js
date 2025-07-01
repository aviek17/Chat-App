const logger = require("../utils/logger");

module.exports = function (io) {
  io.on('connection', (socket) => {
    logger.success('🟢 New client connected:', socket.id);

    // chat controllers

    socket.on('disconnect', () => {
      logger.error('🔴 Client disconnected:', socket.id);
    });
  });
};
