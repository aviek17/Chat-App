const express = require('express');
const router = express.Router();

//const firebaseAuthMiddleware = require("../middlewares/firebaseAuth");

const userController = require('../controllers/UserController');
const { userRequestSchema } = require('../validation/user');
const validateRequest = require('../middlewares/validator');


//routing
router.post('/sign-up', validateRequest(userRequestSchema), userController.signup);

module.exports = router;