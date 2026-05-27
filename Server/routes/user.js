const express = require('express');
const router = express.Router();


//const firebaseAuthMiddleware = require("../middlewares/firebaseAuth");

const userController = require('../controllers/UserController');
const { userRequestSchema } = require('../validation/user');
const validateRequest = require('../middlewares/validator');
const httpAuthMiddleware = require('../middlewares/httpAuth');
const profilePhotoMiddleware = require("../middlewares/profilePhotoUpload")


//routing
router.post('/sign-up', validateRequest(userRequestSchema), userController.signup);

router.post("/login", validateRequest(userRequestSchema), userController.login);

router.post("/update-profile-picture", httpAuthMiddleware, profilePhotoMiddleware, userController.updateProfilePicture);

router.post("/update-profile", httpAuthMiddleware, userController.updateProfile);

router.post("/get-user-info-on-phone-number", httpAuthMiddleware, userController.getUserInfoOnPhoneNumber);

router.post("/add-new-contact", httpAuthMiddleware, userController.addNewContact);

router.get("/contacts", httpAuthMiddleware, userController.getAllContacts);

router.post("/request-approval", httpAuthMiddleware, userController.requestApproval);

router.get("/user-pending-requests", httpAuthMiddleware, userController.getUserPendingRequests);

router.get("/contact-pending-requests", httpAuthMiddleware, userController.getContactPendingRequests);

router.get("/vercel/status", (req, res) => res.json("Vercel is up and running! Enjoy developement!!!"));


module.exports = router;