const { verifyToken } = require('../utils/jwtUtils');


const socketAuthMiddleware = async (socket, next) => {
    try {
        const token = socket.handshake.auth.token ||
            socket.handshake.query.token ||
            socket.handshake.headers.authorization?.replace('Bearer ', '') ||
            socket.handshake.headers.authorization?.replace('bearer ', '') || 
            socket.request.headers.cookie?.match(/token=([^;]+)/)?.[1];

        if (!token) {
            const error = new Error('Access denied. No token provided.');
            error.statusCode = 401;
            return next(error);
        }

        //check if token is valid
        const decoded = verifyToken(token);
        if(!decoded.uid){
            const error = new Error('Access denied. Invalid Token');
            error.statusCode = 401;
            return next(error);
        }

        next();
    } catch (error) {
        console.error('HTTP Auth Error:', error);
        error.statusCode = 401;
        error.message = 'Invalid token';
        next(error);
    }
};

module.exports = socketAuthMiddleware;