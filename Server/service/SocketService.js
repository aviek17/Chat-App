module.exports = function (io) {
  io.on('connection', (socket) => {
    console.log('🟢 New client connected:', socket.id);

    // Handle incoming messages
    socket.on('message', (data) => {
      console.log('📨 Message received:', data);
      io.emit('message', data); // broadcast to all
    });

    socket.on('disconnect', () => {
      console.log('🔴 Client disconnected:', socket.id);
    });
  });
};
