const { findUserByEmail, createUser } = require('../repo/UserRepo');
const { generateToken } = require('../utils/jwtUtils');
const { generateUniqueUserId } = require('./CommonService');

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

    return { token, user: { email: user.email, uid: user.uid } };
}


const handleUserLogin = async (userInfo) => {

}


module.exports = { handleUserCreation, handleUserLogin };





