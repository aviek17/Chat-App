const express = require('express');
const router = express.Router();

const httpAuthMiddleware = require('../middlewares/httpAuth');
const chatController = require('../controllers/ChatController');

router.get("/user-display-message", httpAuthMiddleware, chatController.getUserDisplayMessage);

router.get("/user-last-messages", httpAuthMiddleware, chatController.getUserLastMessages);



module.exports = router;