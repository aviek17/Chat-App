const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const logger = require('./utils/logger');
const path = require('path');

const userRouter = require('./routes/user');
const chatRouter = require('./routes/chat');
const errorHandler = require('./middlewares/errorHandler');
const socketHandler = require("./service/SocketService");
const socketAuthMiddleware = require('./middlewares/socketAuth');


const app = express();
app.disable('etag');

// ─── Allowed Origins ──────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:3100',
  'http://localhost:5173',
  'http://192.168.29.48:3100',
  'https://chat-app-one-gold-74.vercel.app',
  process.env.CLIENT_URL,        // production origin from env
].filter(Boolean);



//no caching
app.use((req, res, next) => {
  if (req.path.startsWith('/profile-photo')) {
    return next();
  }

  res.setHeader(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, private'
  );

  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  next();
});

//http cors
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-New-Token'],
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// db connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => logger.success('MongoDB connected'))
  .catch(err => logger.error('MongoDB connection error: ' + err));



// routing context path
const contextPath = process.env.CONTEXT_PATH || '';

app.use(`${contextPath}/user`, userRouter);
app.use(`${contextPath}/chat`, chatRouter);
app.use(
  "/profile-photo",
  express.static(path.join(__dirname, "public/photo"), {
    maxAge: '30d',
    etag: true,
    lastModified: true,
    setHeaders: (res) => {
      res.setHeader(
        'Cache-Control',
        'public, max-age=2592000, immutable'
      );
    }
  })
);

// http server setup
const server = http.createServer(app);
console.log(`${contextPath}/socket.io`)



//socket server setup
const io = new Server(server, {
  path: `${contextPath}/socket.io`,
  transports: ['polling', 'websocket'], // Add this line
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: false
  }
});
io.use(socketAuthMiddleware);

logger.success(" Socket.IO server initialized");
socketHandler(io);

//global error handler
app.use(errorHandler)

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => logger.info(`Server running on port ${PORT}`));

