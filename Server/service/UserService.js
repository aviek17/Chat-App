const { findUserByEmail, createUser, updateLastLogin } = require('../repo/UserRepo');
const { generateToken } = require('../utils/jwtUtils');
const { generateUniqueUserId } = require('./CommonService');


const getUserInfo = (user) => {
    return {
        id: user._id,
        uid: user.uid,
        displayName: user.displayName || user.username,
        bio: user.bio || "",
        phoneNo: user.phoneNumber || "",
        email : user.email
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

    const token = generateToken({ id: user.uid, email: email });

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

    const token = generateToken({ id: existingUser.uid, email: email });
    return { token, user: getUserInfo(existingUser) };

}


module.exports = { handleUserCreation, handleUserLogin };





