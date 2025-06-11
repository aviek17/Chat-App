const AuthError = require('../errors/AuthError');
const firebase = require('../service/firebase');

const firebaseAuthMiddleware = async (req, res, next) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (!idToken) {
    throw new AuthError('Invalid token');
  }

  try {
    const decodedToken = await firebase.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    next(error)
  }
};

module.exports = firebaseAuthMiddleware;
