const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const logger = require("../utils/logger");

const User = require("../models/User");
const ProfilePhoto = require("../models/ProfilePicture");
const UserContact = require("../models/UserContact");
const ChatPreference = require('../models/ChatPreference');


class UserRepository {

  async findUserByEmail(email, includePassword = false) {
    const query = User.findOne({ email });

    if (includePassword) {
      query.select("+password");
    }

    return await query;
  }

  async createUser(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async updateLastLogin(user) {
    user.lastLogin = new Date();
    return await user.save();
  }

  async getProfilePhotoByUid(uid) {
    const response = await ProfilePhoto.findOne({
      uid,
      isActive: true
    });

    return response || "";
  }

  async updateUserProfileInfo(userData, updateData) {
    return await User.findOneAndUpdate(
      { uid: userData.uid },
      {
        username: updateData.userName,
        displayName: updateData.displayName,
        phoneNumber: updateData.phoneNo,
        bio: updateData.bio
      },
      { new: true }
    );
  }

  async updateProfilePhoto(userData, photoData) {
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

  async userInfoOnPhoneNumber(userid, phoneNumber) {

    const currentUserObjectId = new mongoose.Types.ObjectId(userid.id);

    const matchedUsers = await User.find({
      phoneNumber: { $regex: `^${phoneNumber}`, $options: 'i' },
      _id: { $ne: currentUserObjectId }
    }).select('displayName email username phoneNumber profilePicture bio');

    if (!matchedUsers.length) return [];

    const matchedUserIds = matchedUsers.map(u => u._id);

    const contactRows = await UserContact.find({
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

  async addNewContacts(userData, contactData) {
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
    const response = await UserContact.sendContactRequest(contactInfo);

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


    return { contactResultReceiver, contactResultSender };
  }

  async getAllContacts(userId) {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const contactList = await UserContact.aggregate([
      {
        $match: {
          userId: userObjectId,
          isFriend: true
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
                    { $eq: ['$userId', '$$currentContactId'] },
                    { $eq: ['$contactUserId', '$$currentUserId'] },
                    { $eq: ['$isFriend', true] }
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
        $match: { reverseContact: { $ne: [] } }
      },

      { $sort: { addedAt: -1 } },

      // Join user doc
      {
        $lookup: {
          from: 'users',
          localField: 'contactUserId',
          foreignField: '_id',
          as: 'user'
        }
      },

      { $unwind: '$user' },

      // Join profile photo
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

      // Join ChatPreference — fetch THIS user's prefs for this contact
      {
        $lookup: {
          from: 'chatpreferences',
          let: {
            ownerId: '$userId',          // logged-in user
            friendId: '$contactUserId'    // the contact
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$userId', '$$ownerId'] },
                    { $eq: ['$friendId', '$$friendId'] }
                  ]
                }
              }
            }
          ],
          as: 'prefs'
        }
      },

      // Unwind prefs — preserveNull so contacts without a prefs row still appear
      {
        $unwind: {
          path: '$prefs',
          preserveNullAndEmptyArrays: true
        }
      },

      {
        $project: {
          _id: 0,

          contactNickname: 1,
          isArchived: { $ifNull: ['$prefs.isArchived', false] },
          isBlocked: { $ifNull: ['$prefs.isBlocked', false] },
          isFavorite: { $ifNull: ['$prefs.isFavorite', false] },
          isMuted: { $ifNull: ['$prefs.isMuted', false] },

          user: {
            id: '$user._id',
            uid: '$user.uid',
            displayName: '$user.displayName',
            username: '$user.username',
            bio: '$user.bio',
            phoneNumber: '$user.phoneNumber',
            email: '$user.email',

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

  async acceptUserRequest(userId, contactUserId) {
    const acceptorUserId = new mongoose.Types.ObjectId(userId);
    const senderUserId = new mongoose.Types.ObjectId(contactUserId);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Fetch both users with avatar
      const [senderUserInfo, acceptorUserInfo] = await Promise.all([
        User.findById(senderUserId).populate({ path: 'profilePicture', select: 'filename path storageType url' }),
        User.findById(acceptorUserId).populate({ path: 'profilePicture', select: 'filename path storageType url' })
      ]);

      if (!senderUserInfo) throw new Error('Sender user not found');
      if (!acceptorUserInfo) throw new Error('Acceptor user not found');

      const acceptorRow = await UserContact.findOneAndUpdate(
        { userId: acceptorUserId, contactUserId: senderUserId, isPending: true },
        { $set: { isPending: false, contactNickname: senderUserInfo.displayName, isFriend: true } },
        { new: true, session }
      );

      if (!acceptorRow) throw new Error('No pending request found');

      const senderRow = await UserContact.findOneAndUpdate(
        { userId: senderUserId, contactUserId: acceptorUserId },
        { $set: { isPending: false, isFriend: true } },
        { new: true, session }
      );

      if (!senderRow) throw new Error('Sender contact row not found');

      await ChatPreference.initializeForFriendship(acceptorUserId, senderUserId, session);

      await session.commitTransaction();
      logger.info(`Request accepted by ${acceptorUserId} sent by ${senderUserId}`);

      const [acceptorPrefs, senderPrefs] = await Promise.all([
        ChatPreference.findOne({ userId: acceptorUserId, friendId: senderUserId }),
        ChatPreference.findOne({ userId: senderUserId, friendId: acceptorUserId })
      ]);

      const buildUserInfo = (contactRow, userDoc, prefs) => {
        const pic = userDoc.profilePicture;
        return {
          contactNickname: contactRow.contactNickname,
          isArchived: prefs?.isArchived ?? false,
          isBlocked: prefs?.isBlocked ?? false,
          isFavorite: prefs?.isFavorite ?? false,
          isMuted: prefs?.isMuted ?? false,
          user: {
            id: userDoc._id,
            uid: userDoc.uid,
            displayName: userDoc.displayName,
            username: userDoc.username,
            bio: userDoc.bio,
            phoneNumber: userDoc.phoneNumber,
            avatar: pic ? {
              filename: pic.filename,
              path: pic.path,
              storageType: pic.storageType
            } : null
          }
        };
      };


      return {
        success: true,
        userInfo: buildUserInfo(acceptorRow, senderUserInfo, acceptorPrefs),
        senderUserInfo: buildUserInfo(senderRow, acceptorUserInfo, senderPrefs)
      };

    } catch (err) {
      await session.abortTransaction();
      logger.error('acceptUserRequest failed:', err);
      throw err;
    } finally {
      session.endSession();
    }
  };

  async rejectUserRequest(userId, contactUserId) {
    const rejectorUserId = new mongoose.Types.ObjectId(userId);
    const senderUserId = new mongoose.Types.ObjectId(contactUserId);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const rejectorRow = await UserContact.findOneAndDelete(
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

  async getUserPendingRequests(userId) {
    const pendingContacts = await UserContact.find({
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

  async getContactPendingRequests(userId) {
    const pendingContacts = await UserContact.find({
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

}

module.exports = new UserRepository();
