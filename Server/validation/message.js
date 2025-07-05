const mongoose = require('mongoose');

function validateObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function validateMessageContent(content) {
  return typeof content === 'string' && content.trim().length > 0 && content.length <= 5000;
}

module.exports = {
    validateObjectId,
    validateMessageContent
}