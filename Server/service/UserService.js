const crypto = require('crypto');
const { findUserByEmail, createUser } = require('../repo/UserRepo');
const { generateToken } = require('./TokenService');

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



module.exports = { handleUserCreation };


//methods 
const generateUniqueUserId = (email) => {
    const emailHash = crypto.createHash('sha256').update(email).digest('hex').substring(0, 8);

    const now = new Date();
    const yy = String(now.getFullYear()).slice(2, 4);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const datePart = yy + mm + dd;

    const randomChar = crypto.randomBytes(1).toString('hex').substring(0, 1);

    return `${emailHash}${datePart}${randomChar}`;
};