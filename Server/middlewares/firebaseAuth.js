const firebase = require('../service/firebase');

const firebaseAuthMiddleware = async (req, res, next) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (!idToken) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decodedToken = await firebase.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = firebaseAuthMiddleware;
