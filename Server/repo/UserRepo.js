const User = require('../models/User');

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save(); 
};

const updateLastLogin = async (user) => {
  user.lastLogin = new Date();
  return await user.save();
};

module.exports = {
  findUserByEmail,
  createUser,
  updateLastLogin,
};
