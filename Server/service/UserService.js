const { findUserByEmail, createUser, updateLastLogin, updateProfilePhoto, getProfilePhotoByUid, updateUserProfileInfo, userInfoOnPhoneNumber,
    addNewContacts, getAllContacts, acceptUserRequest, rejectUserRequest, getUserPendingRequests, getContactPendingRequests }
    = require('../repo/UserRepo');
const { generateToken } = require('../utils/jwtUtils');
const { generateUniqueUserId } = require('./CommonService');
const { getChatSocketService, getUserSocketService } = require('./SocketService');



const getUserInfo = (user) => {
    return {
        id: user._id,
        uid: user.uid,
        displayName: user.displayName || user.username,
        bio: user.bio || "",
        phoneNo: user.phoneNumber || "",
        email: user.email,
        userName: user.username,
        profilePicture: user.profilePicture || "",
    }
}

const handleUserCreation = async (userInfo) => {
    const { email, password } = userInfo;

    const existingUser = await findUserByEmail(email);

    if (existingUser) throw new Error('User already exists');

    const data = {
        uid: generateUniqueUserId(email),
        email: userInfo.email,
        password,
        username: userInfo.email.split('@')[0],
        lastLogin: new Date(),
    };

    const user = await createUser(data);

    const token = generateToken({ id: user._id, uid: user.uid, email: email, username: user.username, displayName: user.displayName });

    return { token, user: getUserInfo(user) };
}

const handleUserLogin = async (userInfo) => {
    const { email, password } = userInfo;

    const existingUser = await findUserByEmail(email, true);
    if (!existingUser) throw new Error('Invalid Credentials');

    const isPasswordValid = await existingUser.comparePassword(password);
    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }

    await updateLastLogin(existingUser);
    const token = generateToken({ id: existingUser._id, uid: existingUser.uid, email: email, username: existingUser.username, displayName: existingUser.displayName });
    const profilePhoto = await getProfilePhotoByUid(existingUser.uid);
    return { token, user: { ...getUserInfo(existingUser), profilePicture: profilePhoto?.filename } };

}

const handleProfilPhotoUpdate = async (userData, fileData) => {
    const filePath = 'public/photo/' + fileData.filename;
    const fileObj = {
        path: filePath,
        filename: fileData.filename,
        mimetype: fileData.mimetype,
        size: fileData.size,
        storageType: 'local',
        updatedAt: new Date()
    }
    const profilePhotoResponse = await updateProfilePhoto(userData, fileObj);
    return profilePhotoResponse;
}

const getUserInfoOnPhoneNumber = async (userInfo, phoneNumber) => {
    if (!phoneNumber) {
        throw new Error("Phone number is required");
    }
    if (typeof phoneNumber !== 'string' || phoneNumber.trim() === '') {
        throw new Error("Invalid phone number");
    }
    if (phoneNumber.length < 5) {
        throw new Error("Phone number is too short");
    }
    if (phoneNumber.length > 10) {
        throw new Error("Phone number is too long");
    }
    const userData = await userInfoOnPhoneNumber(userInfo, phoneNumber);
    return userData;
}

const handleProfileUpdate = async (userInfo, updateData) => {
    if (!userInfo?.uid) {
        throw new Error("User not found");
    }
    if (updateData?.bio?.trim()?.length > 200) {
        throw new Error("Bio exceeds 200 characters");
    }
    const response = await updateUserProfileInfo(userInfo, updateData);
    return getUserInfo(response);
}

const addNewContact = async (userInfo, contactData) => {

    if (!contactData.contactUserId) {
        throw new Error("No Id found for new contact");
    }
    if (!contactData.sourceValue) {
        throw new Error("No Phone No found");
    }
    if (!contactData.sourceType) {
        throw new Error("No contact type found");
    }

    let result = await addNewContacts(userInfo, contactData);

    const chatSocketService = getChatSocketService();
    if (result && chatSocketService) {
        chatSocketService.handleNewContact(userInfo, contactData, result?.contactResultSender)
    }

    return result?.contactResultReceiver;

}


const getContactList = async (userInfo) => {
    const userId = userInfo?.id;
    console.log("Fetching contact list for userId:", userId);
    if (!userId) {
        throw new Error("User not found");
    }
    const responsedata = await getAllContacts(userId);
    return responsedata;
}

const userRequestApproval = async (userInfo, requestInfo) => {
    const userId = userInfo?.id;
    if (!userId) throw new Error("User not found");
    if (!requestInfo?.contactUserId) throw new Error("Friend user id is required");
    if (!requestInfo?.action || !['accept', 'reject', 'cancel'].includes(requestInfo.action)) {
        throw new Error("Invalid action. Must be 'accept', 'reject', or 'cancel'");
    }

    const userSocketService = getUserSocketService();
    let result = null;

    if (requestInfo.action === 'accept') {
        const { senderUserInfo, ...acceptResult } = await acceptUserRequest(userId, requestInfo.contactUserId);
        result = acceptResult;

        if (result.success && userSocketService) {
            userSocketService.handleRequestAccepted(userInfo, requestInfo.contactUserId, senderUserInfo);
        }
    }
    else if (requestInfo.action === 'reject') {
        result = await rejectUserRequest(userId, requestInfo.contactUserId);

        if (result.success && userSocketService) {
            userSocketService.handleRequestRejected(userInfo, requestInfo.contactUserId);
        }
    }
    else if (requestInfo.action === 'cancel') {
        // your cancel logic here
    }

    return result;
};

const userPendingRequest = async (userInfo) => {
    const userId = userInfo?.id;
    if (!userId) {
        throw new Error("User not found");
    }
    const responseData = await getUserPendingRequests(userId);
    return responseData;
}

const contactPendingRequest = async (userInfo) => {
    const userId = userInfo?.id;
    if (!userId) {
        throw new Error("User not found");
    }
    const responseData = await getContactPendingRequests(userId);
    return responseData;
}

module.exports = { handleUserCreation, handleUserLogin, handleProfileUpdate, handleProfilPhotoUpdate, getUserInfoOnPhoneNumber, addNewContact, getContactList, userRequestApproval, userPendingRequest, contactPendingRequest };





