const fs = require("fs");
const path = require("path");
const logger = require("../utils/logger");

const User = require('../models/User');
const ProfilePhoto = require("../models/ProfilePicture");
const { default: mongoose } = require("mongoose");
const userContact = require("../models/chats/PrivateChat/userContact");

const findUserByEmail = async (email, includePassword = false) => {
  const query = User.findOne({ email });
  if (includePassword) {
    query.select('+password');
  }
  return await query;
};


const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

const updateLastLogin = async (user) => {
  user.lastLogin = new Date();
  return await user.save();
};

const getProfilePhotoByUid = async (uid) => {
  const response = await ProfilePhoto.findOne({ uid, isActive: true });
  if (!response) {
    return "";
  }
  return response;
}

const updateUserProfileInfo = async (userData, updateData) => {
  const userInfo = await User.findOneAndUpdate({ uid: userData.uid }, {
    username: updateData.userName,
    displayName: updateData.displayName,
    phoneNumber: updateData.phoneNo,
    bio: updateData.bio
  }, { new: true });
  return userInfo;
}

const updateProfilePhoto = async (userData, photoData) => {
  const userInfo = await ProfilePhoto.findOne({ uid: userData.uid, isActive: true });

  if (userInfo?.filename && userInfo?.path) {
    const oldPath = path.join(__dirname, '../', userInfo.path);
    fs.unlink(oldPath, (err) => {
      if (err) {
        logger.error("Failed to delete old profile photo:", err);
      } else {
        logger.success("Old profile photo deleted successfully");
      }
    });
  }
  const updatedPic = await ProfilePhoto.findOneAndUpdate(
    { userId: userData.id, uid: userData.uid, isActive: true },
    { userId: userData.id, uid: userData.uid, ...photoData },
    { new: true, upsert: true }
  );

  await User.findByIdAndUpdate(userData.id, {
    profilePicture: updatedPic._id
  });

  return updatedPic;
}

const userInfoOnPhoneNumber = async (userid, phoneNumber) => {

  console.log( "user ID:", userid);

  const currentUserObjectId = new mongoose.Types.ObjectId(userid.id);

  const matchedUsers = await User.find({
    phoneNumber: { $regex: `^${phoneNumber}`, $options: 'i' },
    _id: { $ne: currentUserObjectId }
  }).select('displayName email username phoneNumber profilePicture bio');

  if (!matchedUsers.length) return [];

  const matchedUserIds = matchedUsers.map(u => u._id);

  const contactRows = await userContact.find({
    userId: currentUserObjectId,     //logged in user id
    contactUserId: { $in: matchedUserIds }
  });

  const contactMap = new Map(
    contactRows.map(c => [c.contactUserId.toString(), c])
  );
  // Return only contacts whose isFriend is false
  const filteredUsers = matchedUsers.filter(user => {
    const contactRow = contactMap.get(user._id.toString());
    return !contactRow
  });

  if (!filteredUsers.length) return [];

  const profilePictureIds = filteredUsers
    .filter(u => u.profilePicture)
    .map(u => u.profilePicture);

  const profilePictures = await ProfilePhoto.find({
    _id: { $in: profilePictureIds }
  }).select('path filename storageType url');

  const pictureMap = new Map(
    profilePictures.map(p => [p._id.toString(), p])
  );

  const result = filteredUsers.map(user => {

    const contactRow = contactMap.get(user._id.toString());
    const pic = pictureMap.get(user.profilePicture?.toString());

    let friendAdded = false;
    let requestSent = false;

    if (contactRow) {
      requestSent = true;
      friendAdded = !contactRow.isPending;
    }

    const avatar = pic
      ? {
        filename: pic.filename,
        path: pic.storageType === 'local'
          ? pic.path
          : pic.url
      }
      : null;

    return {
      id: user._id,
      displayName: user.displayName,
      email: user.email,
      username: user.username,
      phoneNumber: user.phoneNumber,
      bio: user.bio,
      avatar,
      friendAdded,
      requestSent
    };
  });

  return result;
};



const addNewContacts = async (userData, contactData) => {
  const senderUserId = new mongoose.Types.ObjectId(userData.id);
  const senderUserName = userData.username;
  const receiverUserId = new mongoose.Types.ObjectId(contactData.contactUserId);
  const sourceType = contactData.sourceType;
  const sourceValue = contactData.sourceValue;
  const senderNickname = contactData.name;
  const receiverNickname = null;
  let contactInfo = {
    senderUserId,
    receiverUserId,
    sourceType,
    sourceValue,
    senderNickname,
    receiverNickname,
    senderUserName
  };
  const response = await userContact.sendContactRequest(contactInfo);

  // Fetch receiver's active profile
  const receiverUser = await User.findById(receiverUserId)
    .select('uid displayName username phoneNumber profilePicture');

  const receiverPic = await ProfilePhoto.findOne({
    userId: receiverUserId,
    isActive: true
  }).select('filename path storageType');

  const contactResultReceiver = {
    [contactData?.uid]: {
      id: receiverUser._id,
      uid: receiverUser.uid,
      displayName: receiverUser.displayName,
      username: receiverUser.username,
      phoneNumber: receiverUser.phoneNumber,
      avatar: {
        filename: receiverPic?.filename || null,
        path: receiverPic?.path || null,
        storageType: receiverPic?.storageType || null
      },
      requestSentBy: response.senderRow.requestSentBy,
    }
  };

  //fetching sender active profile

  const senderUser = await User.findById(senderUserId)
    .select('uid displayName username phoneNumber profilePicture');

  const senderPic = await ProfilePhoto.findOne({
    userId: senderUserId,
    isActive: true
  }).select('filename path storageType');

  const contactResultSender = {
    [contactData?.uid]: {
      id: senderUser._id,
      uid: senderUser.uid,
      displayName: senderUser.displayName,
      username: senderUser.username,
      phoneNumber: receiverUser.phoneNumber,
      avatar: {
        filename: senderPic?.filename || null,
        path: senderPic?.path || null,
        storageType: senderPic?.storageType || null
      },
      requestSentBy: response.senderRow.requestSentBy,
    }
  };


  return {contactResultReceiver, contactResultSender};
}


const getAllContacts = async (userId) => {
  const contactList = await userContact.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        isPending: false
      }
    },

    // Check reverse relationship
    {
      $lookup: {
        from: 'usercontacts',
        let: {
          currentUserId: '$userId',
          currentContactId: '$contactUserId'
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ['$userId', '$$currentContactId']
                  },
                  {
                    $eq: ['$contactUserId', '$$currentUserId']
                  },
                  {
                    $eq: ['$isPending', false]
                  }
                ]
              }
            }
          }
        ],
        as: 'reverseContact'
      }
    },

    // Only keep records where reverse relation exists
    {
      $match: {
        reverseContact: { $ne: [] }
      }
    },

    { $sort: { addedAt: -1 } },

    {
      $lookup: {
        from: 'users',
        localField: 'contactUserId',
        foreignField: '_id',
        as: 'user'
      }
    },

    { $unwind: '$user' },

    {
      $lookup: {
        from: 'profilephotos',
        localField: 'user.profilePicture',
        foreignField: '_id',
        as: 'avatar'
      }
    },

    {
      $unwind: {
        path: '$avatar',
        preserveNullAndEmptyArrays: true
      }
    },

    {
      $project: {
        _id: 0,

        isFavorite: 1,
        isBlocked: 1,
        isArchived: 1,
        isMuted: 1,
        contactNickname: 1,

        user: {
          id: '$user._id',
          uid: '$user.uid',
          displayName: '$user.displayName',
          username: '$user.username',
          bio: '$user.bio',
          phoneNumber: '$user.phoneNumber',

          avatar: {
            $cond: {
              if: { $ifNull: ['$avatar', false] },
              then: {
                filename: '$avatar.filename',
                path: '$avatar.path',
                url: '$avatar.url',
                storageType: '$avatar.storageType'
              },
              else: null
            }
          }
        }
      }
    }
  ]);
  return contactList ?? [];
}


const acceptUserRequest = async (userId, contactUserId) => {
  const acceptorUserId = new mongoose.Types.ObjectId(userId);
  const senderUserId = new mongoose.Types.ObjectId(contactUserId);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const senderUserInfo = await User.findById(senderUserId);
    if (!senderUserInfo) {
      throw new Error('Sender user not found');
    }
    const acceptorRow = await userContact.findOneAndUpdate(
      { userId: acceptorUserId, contactUserId: senderUserId, isPending: true },
      { $set: { isPending: false, contactNickname: senderUserInfo.displayName, isFriend: true } },
      { new: true, session }
    );
    if (!acceptorRow) {
      throw new Error('No pending request found');
    }

    const senderRow = await userContact.findOneAndUpdate(
      { userId: senderUserId, contactUserId: acceptorUserId },
      { $set: { isPending: false, isFriend: true } },
      { new: true, session }
    );

    if (!senderRow) {
      throw new Error('Sender contact row not found');
    }

    await session.commitTransaction();
    logger.info(`Request accepted by ${acceptorUserId} sent by ${senderUserId}`);
    return { success: true, message: 'Contact request accepted' };

  } catch (err) {
    await session.abortTransaction();
    logger.error('acceptUserRequest failed:', err);
    throw err;
  } finally {
    session.endSession();
  }
}


const rejectUserRequest = async (userId, contactUserId) => {
  const rejectorUserId = new mongoose.Types.ObjectId(userId);
  const senderUserId = new mongoose.Types.ObjectId(contactUserId);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const rejectorRow = await userContact.findOneAndDelete(
      { userId: rejectorUserId, contactUserId: senderUserId },
      { session }
    );

    if (!rejectorRow) {
      throw new Error('No pending request found');
    }

    const senderRow = await UserContact.findOneAndDelete(
      { userId: senderUserId, contactUserId: rejectorUserId },
      { session }
    );

    if (!senderRow) {
      throw new Error('Sender contact row not found');
    }

    await session.commitTransaction();
    logger.info(`Request rejected: ${rejectorUserId} rejected ${senderUserId}`);
    return { success: true, message: 'Contact request rejected' };


  } catch (err) {
    session.abortTransaction();
    logger.error('rejectUserRequest failed:', err);
    throw err;
  } finally {
    session.endSession();
  }
}


//logged in user need to accepth this request
const getUserPendingRequests = async (userId) => {
  const pendingContacts = await userContact.find({
    userId: new mongoose.Types.ObjectId(userId),
    isPending: true,
    isFriend: false
  });

  const contactUserIds = pendingContacts.map(
    (contact) => contact.contactUserId
  );

  const users = await User.find({
    _id: { $in: contactUserIds }
  }).select(
    'uid displayName username phoneNumber profilePicture'
  );

  const profilePictureIds = users
    .filter((user) => user.profilePicture)
    .map((user) => user.profilePicture);

  const profilePictures = await ProfilePhoto.find({
    _id: { $in: profilePictureIds }
  }).select('filename path storageType');

  const pictureMap = new Map(
    profilePictures.map((pic) => [
      pic._id.toString(),
      pic
    ])
  );

  const response = users.map((user) => {

    const pic = pictureMap.get(
      user.profilePicture?.toString()
    );

    return {
      id: user._id,
      uid: user.uid,
      displayName: user.displayName,
      username: user.username,
      phoneNumber: user.phoneNumber,
      avatar: pic
        ? {
          filename: pic.filename,
          path: pic.path,
          storageType: pic.storageType
        }
        : null
    };
  });

  return response;
}


//logged in user send those requests that need to be accepted by other user
const getContactPendingRequests = async (userId) => {
  const pendingContacts = await userContact.find({
    userId: new mongoose.Types.ObjectId(userId),
    isPending: false,
    isFriend: false
  });

  const contactUserIds = pendingContacts.map(
    (contact) => contact.contactUserId
  );

  const users = await User.find({
    _id: { $in: contactUserIds }
  }).select(
    'uid displayName username phoneNumber profilePicture'
  );

  const profilePictureIds = users
    .filter((user) => user.profilePicture)
    .map((user) => user.profilePicture);

  const profilePictures = await ProfilePhoto.find({
    _id: { $in: profilePictureIds }
  }).select('filename path storageType');

  const pictureMap = new Map(
    profilePictures.map((pic) => [
      pic._id.toString(),
      pic
    ])
  );

  const response = users.map((user) => {

    const pic = pictureMap.get(
      user.profilePicture?.toString()
    );

    return {
      id: user._id,
      uid: user.uid,
      displayName: user.displayName,
      username: user.username,
      phoneNumber: user.phoneNumber,
      avatar: pic
        ? {
          filename: pic.filename,
          path: pic.path,
          storageType: pic.storageType
        }
        : null
    };
  });

  return response;
}




module.exports = {
  findUserByEmail,
  createUser,
  updateLastLogin,
  updateProfilePhoto,
  getProfilePhotoByUid,
  updateUserProfileInfo,
  userInfoOnPhoneNumber,
  addNewContacts,
  getAllContacts,
  acceptUserRequest,
  rejectUserRequest,
  getUserPendingRequests,
  getContactPendingRequests,

};
