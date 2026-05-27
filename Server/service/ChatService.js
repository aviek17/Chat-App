const ChatRepository = require ("../repo/ChatRepo");


const userChatDisplayMessageService = async (userInfo) => {
    if(!userInfo.id){
        throw new Error("User not found");
    }
    const responseData = await ChatRepository.getUserDisplayMessage(userInfo.id);
    return responseData ?? {};

}


const userLastMessagesService = async (userId) => {
    if(!userId){
        throw new Error("User not found");
    }
    const responseData = await ChatRepository.getUserLastMessages(userId);
    return responseData ?? {};
}






module.exports = {userChatDisplayMessageService, userLastMessagesService};