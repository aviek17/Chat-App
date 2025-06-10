const express = require('express');
const router = express.Router();

const firebaseAuthMiddleware = require("../middlewares/firebaseAuth");

const userController = require('../controllers/UserController');


//routing
router.post('/sign-up', firebaseAuthMiddleware, userController.signup);

module.exports = router;