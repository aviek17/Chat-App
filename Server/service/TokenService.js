const jwt = require('jsonwebtoken');

const jwtSecretKey = process.env.JWT_SECRET;

const generateToken = (payload, expiresIn = '7d') => {
    return jwt.sign(payload, jwtSecretKey, { expiresIn });
};

const verifyToken = (token) => {
    return jwt.verify(token, jwtSecretKey);
};


module.exports = {
    generateToken,
    verifyToken
}