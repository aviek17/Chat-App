const logger = require('./../utils/logger');

const userService = require("../service/UserService")


const signup = async (req, res, next) => {
    try {
        const responseData = await userService.handleUserCreation(req.validatedBody);
        res.status(200).json(responseData);
    } catch (err) {
        next(err);
    }
}


const login = async (req, res, next) => {
    try{
        const responseData = await userService.handleUserLogin(req.validatedBody);
        res.status(200).json(responseData);
    }catch(err) {
        next(err);
    }
}


const updateProfile = async (req, res, next) => {
    
}

module.exports = { signup, login, updateProfile };