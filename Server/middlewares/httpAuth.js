// middleware/httpAuth.js - For HTTP requests
const { verifyAndRefresh } = require('../utils/jwtUtils');
const logger = require("../utils/logger");

const httpAuthMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '') ||
            req.cookies.token ||
            req.query.token;


        if (!token) {
            const error = new Error('Access denied. No token provided.');
            error.statusCode = 401;
            return next(error);
        }

        // Verify token and check if refresh is needed
        const { decoded, newToken, refreshed } = verifyAndRefresh(token);

        // Use token data for performance (skip DB lookup for most cases)
        if (decoded.email && decoded.username && decoded.uid) {
            req.user = {
                uid: decoded.uid,
                email: decoded.email,
                username: decoded.username
            };
            req.userId = decoded.uid;
        }

        // Handle token refresh for HTTP responses
        if (refreshed && newToken) {
            res.setHeader('X-New-Token', newToken);

            // Update cookie if using cookie-based auth
            if (req.cookies.token) {
                res.cookie('token', newToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                    sameSite: 'strict'
                });
            }
        }

        next();
    } catch (error) {
        logger.error('HTTP Auth Error:', error);
        error.statusCode = 401;
        error.message = 'Invalid token';
        next(error); 
    }
};

module.exports = httpAuthMiddleware;