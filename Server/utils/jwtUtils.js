const jwt = require('jsonwebtoken');

const jwtSecretKey = process.env.JWT_SECRET;

const generateToken = (payload, expiresIn = '7d') => {
    return jwt.sign(payload, jwtSecretKey, { expiresIn });
};

const verifyToken = (token) => {
    return jwt.verify(token, jwtSecretKey);
};

// Check if token needs refresh (after 1 day of generation)
const shouldRefreshToken = (decodedToken) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const tokenAge = currentTime - decodedToken.iat;
    const oneDayInSeconds = 24 * 60 * 60;
    
    return tokenAge > oneDayInSeconds;
};

// Refresh token with new expiry
const refreshToken = (oldToken) => {
    try {
        const decoded = jwt.verify(oldToken, jwtSecretKey);
        // Remove JWT standard claims to avoid conflicts
        const { iat, exp, ...payload } = decoded;
        
        // Generate new token with same payload but new expiry
        return generateToken(payload, '7d');
    } catch (error) {
        throw new Error('Invalid token for refresh');
    }
};

// Verify and auto-refresh if needed
const verifyAndRefresh = (token) => {
    try {
        const decoded = verifyToken(token);
        
        if (shouldRefreshToken(decoded)) {
            const newToken = refreshToken(token);
            return {
                decoded,
                newToken,
                refreshed: true
            };
        }
        
        return {
            decoded,
            newToken: null,
            refreshed: false
        };
    } catch (error) {
        throw error;
    }
};


module.exports = {
    generateToken,
    verifyToken,
    verifyAndRefresh
}