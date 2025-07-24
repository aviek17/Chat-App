const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const logger = require('./utils/logger');

const userRouter = require('./routes/user');
const errorHandler = require('./middlewares/errorHandler');
const socketHandler = require("./service/SocketService");
const socketAuthMiddleware = require('./middlewares/socketAuth');


const app = express();
app.use(cors());
app.use(bodyParser.json());


mongoose.connect(process.env.MONGO_URI)
  .then(() => logger.success('MongoDB connected'))
  .catch(err => logger.error('MongoDB connection error: ' + err));


const contextPath = process.env.CONTEXT_PATH || '';

app.use( `${contextPath}/user` , userRouter);


const server = http.createServer(app);

//socket server setup
const io = new Server(server, {
  transports: ['polling', 'websocket'], // Add this line
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["*"],
    credentials: true
  }
});
//io.use(socketAuthMiddleware);
// Add this debug logging
io.engine.on("connection_error", (err) => {
  logger.error("Socket.IO connection error:", err.req);
  logger.error("Error code:", err.code);
  logger.error("Error message:", err.message);
  logger.error("Error context:", err.context);
});

logger.success(" Socket.IO server initialized");
socketHandler(io);

//global error handler
app.use(errorHandler)

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => logger.info(`Server running on port ${PORT}`));

