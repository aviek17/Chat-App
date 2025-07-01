module.exports = function (io) {
  io.on('connection', (socket) => {
    console.log('🟢 New client connected:', socket.id);

    // chat controllers

    socket.on('disconnect', () => {
      console.log('🔴 Client disconnected:', socket.id);
    });
  });
};
