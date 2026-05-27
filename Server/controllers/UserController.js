const logger = require('./../utils/logger');
const userService = require("../service/UserService");



const signup = async (req, res, next) => {
    try {
        const responseData = await userService.handleUserCreation(req.validatedBody);
        res.status(200).json(responseData);
    } catch (err) {
        next(err);
    }
}


const login = async (req, res, next) => {
    try {
        const responseData = await userService.handleUserLogin(req.validatedBody);
        res.status(200).json(responseData);
    } catch (err) {
        next(err);
    }
}


const updateProfilePicture = async (req, res, next) => {
    try {
        const responseData = await userService.handleProfilPhotoUpdate(req.user, req.file);
        res.status(200).json({ success: true, uid: req.user.uid, filename: responseData.filename });
    } catch (err) {
        next(err);
    }

}

const updateProfile = async (req, res, next) => {
    try {
        const responseData = await userService.handleProfileUpdate(req.user, req.body);
        res.status(200).json({ success: true, uid: responseData.uid, user: responseData });
    } catch (err) {
        next(err);
    }
}

const getUserInfoOnPhoneNumber = async (req, res, next) => {
    try {
        const responseData = await userService.getUserInfoOnPhoneNumber(req.user, req.body.phoneNumber);
        if (!responseData) {
            return res.json({ success: false, message: "No user found with the provided phone number" });
        }
        res.status(200).json({ success: true, users: responseData });
    } catch (err) {
        next(err);
    }
}

const addNewContact = async (req, res, next) => {
    try {
        const responseData = await userService.addNewContact(req.user, req.body);
        if (!responseData) {
            return res.json({ success: false, message: "New Contact can not be added" });
        }
        res.status(200).json({ success: true, data : responseData });

    } catch (err) {
        return res.status(400).json({ message: err.message })
    }
}


const getAllContacts = async (req, res, next) => {
    try {
        const responseData = await userService.getContactList(req.user);
        if (!responseData) {
            return res.json({ success: false, message: "No contacts found" });
        }
        res.status(200).json({ success: true, contacts: responseData });
    } catch (err) {
        return res.status(400).json({ message: err.message })
    }
}

const requestApproval = async (req, res, next) => {
    try {
        const responseData = await userService.userRequestApproval(req.user, req.body);
        if (!responseData) {
            return res.json({ success: false, message: "Unable to process the request" });
        }
        res.status(200).json(responseData);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}


const getUserPendingRequests = async (req, res, next) => {
    try {
        const responseData = await userService.userPendingRequest(req.user);    
        if (!responseData) {
            return res.json({ success: false, message: "Unable to fetch pending requests" });
        }   
        res.status(200).json({success: true, pendingRequests: responseData});
       
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

const getContactPendingRequests = async (req, res, next) => {
    try {
        const responseData = await userService.contactPendingRequest(req.user);    
        if (!responseData) {
            return res.json({ success: false, message: "Unable to fetch pending requests" });
        }   
        res.status(200).json({success: true, pendingRequests: responseData});
       
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}



module.exports = { signup, login, updateProfilePicture, updateProfile, addNewContact, getUserInfoOnPhoneNumber, getAllContacts, requestApproval , getUserPendingRequests, getContactPendingRequests};