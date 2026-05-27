const logger = require('./../utils/logger');
const chatService = require("../service/ChatService");


const getUserDisplayMessage = async (req, res, next) => {
    try{
        const userInfo = req.user; 
        const responsedata = await chatService.userChatDisplayMessageService(userInfo);
        res.status(200).json({ success: true, data: responsedata });
    }catch(err){
        next(err);
    }
}

const getUserLastMessages = async (req, res, next) => {
    try{
        const userId = req.user.id; 
        const responsedata = await chatService.userLastMessagesService(userId);
        res.status(200).json({ success: true, data: responsedata });
    }catch(err){
        next(err);
    }
}


module.exports = {getUserDisplayMessage, getUserLastMessages};