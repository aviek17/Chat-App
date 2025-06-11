const errorHandler = (err, req, res, next) => {
  console.error('[Error]', err);

  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    message,
    errors: err.errors || [],
  });
};

module.exports = errorHandler;