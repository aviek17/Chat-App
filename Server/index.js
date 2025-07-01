const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const http = require('http');
const socketServer = require('socket.io');
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
  .catch(err => logger.error('MongoDB connection error: '+ err));

  

app.use('/user', userRouter);



//global error handler
app.use(errorHandler)

const server = http.createServer(app);

//socket server setup
const io = socketServer(server, {
  cors: {
    origin: "*", //process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ['GET', 'POST']
  }
});
io.use(socketAuthMiddleware);
socketHandler(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => logger.info(`Server running on port ${PORT}`));

