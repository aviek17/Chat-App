const User = require('../models/User');

const findUserByEmail = async (email, includePassword = false) => {
  const query = User.findOne({ email });
  if (includePassword) {
    query.select('+password');
  }
  return await query;
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
