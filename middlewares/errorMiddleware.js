const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  logger.error(`${req.method} ${req.originalUrl} - ${err.message}`);

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack, // Hide stack in production
  });
};

module.exports = {
  errorHandler,
};
