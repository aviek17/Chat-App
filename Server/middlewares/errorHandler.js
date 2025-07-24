const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  logger.error(`${err.message}`);

  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    message,
    errors: err.message || [],
  });
};

module.exports = errorHandler;